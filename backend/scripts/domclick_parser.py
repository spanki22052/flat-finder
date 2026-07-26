#!/usr/bin/env python3
"""
DomClick apartment listing parser.
Usage: python3 domclick_parser.py <url>
Outputs JSON to stdout. Non-zero exit code on error (also outputs {"error": "..."} JSON).
"""
from __future__ import annotations

import json
import re
import sys
import asyncio
import os
from typing import Any
from urllib.parse import urlparse, unquote


BLOCK_MARKERS = [
    "qrator", "captcha", "cloudflare", "forbidden", "доступ запрещён",
    "access denied", "blocked", "похоже, ваш запрос выглядит необычно",
]

HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://domclick.ru/",
    "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Upgrade-Insecure-Requests": "1",
}


def looks_blocked(html: str) -> bool:
    lo = html.lower()
    markers = [marker for marker in BLOCK_MARKERS if marker in lo]
    if not markers:
        return False

    # DomClick bundles legitimately contain words like "forbidden". A page that
    # includes listing data is not a block response, even when it has a marker.
    if "window.__ssr_state__" in lo and "productcard" in lo:
        return False
    if re.search(r'property=["\']og:title["\']', html, re.I) and re.search(r"\d[\d\s]*руб", html, re.I):
        return False

    return True


def extract_offer_id(url: str) -> str | None:
    m = re.search(r"(?:sale|rent)__(?:flat|new_flat|room|house|layout)__(\d+)", url, re.I)
    return m.group(1) if m else None


def infer_city_from_url(url: str) -> str | None:
    known = {
        "tyumen": "Тюмень", "moscow": "Москва", "spb": "Санкт-Петербург",
        "ekaterinburg": "Екатеринбург", "novosibirsk": "Новосибирск",
        "kazan": "Казань", "krasnodar": "Краснодар", "sochi": "Сочи",
        "samara": "Самара", "ufa": "Уфа", "omsk": "Омск",
        "chelyabinsk": "Челябинск", "perm": "Пермь", "voronezh": "Воронеж",
        "rostov": "Ростов-на-Дону",
    }
    try:
        host = urlparse(url).hostname or ""
        m = re.match(r"^([a-z0-9-]+)\.domclick\.", host, re.I)
        if m:
            sub = m.group(1).lower()
            if sub not in ("www", "domclick"):
                return known.get(sub)
    except Exception:
        pass
    return None


def extract_phones(text: str | None) -> list[str]:
    if not text:
        return []
    phones = re.findall(r"(?:\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}", text)
    return list(dict.fromkeys(phones))


def parse_price(text: str | None) -> int | None:
    if not text:
        return None
    cleaned = re.sub(r"[^\d]", "", text)
    return int(cleaned) if cleaned else None


def parse_proxy_url(proxy_url: str | None) -> dict[str, str] | None:
    """Splits `http://user:pass@host:port` into Playwright's
    {server, username, password} shape. Chromium's --proxy-server CLI flag
    cannot parse embedded credentials, so passing the raw URL as `server`
    leaves the browser stuck on an unauthenticated proxy tunnel (goto hangs
    until timeout, page.content() stays empty)."""
    if not proxy_url:
        return None
    parsed = urlparse(proxy_url)
    if not parsed.hostname:
        return None
    scheme = parsed.scheme or "http"
    server = f"{scheme}://{parsed.hostname}:{parsed.port}" if parsed.port else f"{scheme}://{parsed.hostname}"
    config: dict[str, str] = {"server": server}
    if parsed.username:
        config["username"] = unquote(parsed.username)
    if parsed.password:
        config["password"] = unquote(parsed.password)
    return config


def decode_entities(s: str) -> str:
    return (s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
             .replace("&quot;", '"').replace("&#39;", "'").replace("&nbsp;", " "))


# ---------------------------------------------------------------------------
# HTML extractors
# ---------------------------------------------------------------------------

def extract_ssr_state(html: str) -> dict | None:
    m = re.search(r"window\.__SSR_STATE__\s*=\s*", html)
    if not m:
        return None
    start = m.end()
    next_win = html.find("window.__", start)
    end_script = html.find("</script>", start)
    end = len(html)
    if next_win != -1:
        end = min(end, next_win)
    if end_script != -1:
        end = min(end, end_script)
    raw = html[start:end].strip().rstrip(";").strip()
    raw = re.sub(r"\bundefined\b", "null", raw)
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass
    return None


def map_from_ssr_state(state: dict, source_url: str) -> dict | None:
    product_card = state.get("productCard")
    if not isinstance(product_card, dict):
        return None

    price_info = product_card.get("priceInfo") or {}
    object_info = product_card.get("objectInfo") or {}
    address = product_card.get("address") or {}
    house = product_card.get("house") or {}
    house_info = house.get("info") or {} if isinstance(house, dict) else {}
    original = product_card.get("originalProduct") or {}
    seller = product_card.get("seller") or {}
    agent = seller.get("agent") or {} if isinstance(seller, dict) else {}

    price = price_info.get("price")
    city = address.get("locality")

    if not isinstance(price, (int, float)) or not city:
        return None

    rooms = object_info.get("rooms")
    area = object_info.get("area")
    floor = object_info.get("floor")
    total_floors = house_info.get("floors") if isinstance(house_info, dict) else None

    description = (
        (object_info.get("description") if isinstance(object_info.get("description"), str) else None)
        or (original.get("description") if isinstance(original.get("description"), str) else None)
    )

    street = (
        (address.get("name") if isinstance(address.get("name"), str) else None)
        or (address.get("displayNameShort") if isinstance(address.get("displayNameShort"), str) else None)
    )

    # Extract district from address.parents
    district = None
    parents = address.get("parents")
    if isinstance(parents, list):
        for p in parents:
            if isinstance(p, dict) and p.get("kind") == "district" and isinstance(p.get("name"), str):
                district = p["name"]
                break

    # Build title
    title_parts = []
    if isinstance(rooms, int):
        title_parts.append("Студия" if rooms == 0 else f"{rooms}-к квартира")
    else:
        title_parts.append("Квартира")
    if isinstance(area, (int, float)):
        title_parts.append(f"{area} м²")
    if isinstance(floor, int):
        if isinstance(total_floors, int):
            title_parts.append(f"{floor}/{total_floors} эт.")
        else:
            title_parts.append(f"{floor} эт.")
    title = ", ".join(title_parts)

    # Photos
    photos_raw = product_card.get("photos") or []
    photos = []
    cdn = "https://img.dmclk.ru"
    for p in photos_raw:
        if isinstance(p, str):
            url = p
        elif isinstance(p, dict):
            url = p.get("url") or ""
        else:
            continue
        if url.startswith("http"):
            photos.append(url)
        elif url.startswith("/"):
            photos.append(cdn + url)
        elif url:
            photos.append(cdn + "/" + url)

    # Phones
    agent_phone = agent.get("phone") if isinstance(agent, dict) else None
    phones = []
    if isinstance(agent_phone, str) and "*" not in agent_phone:
        phones.extend(extract_phones(agent_phone))
    phones.extend(extract_phones(description))
    phones = list(dict.fromkeys(phones))

    currency_raw = price_info.get("currency", "RUB")
    currency = str(currency_raw).upper() if isinstance(currency_raw, str) else "RUB"
    if currency not in ("RUB", "USD", "EUR"):
        currency = "RUB"

    result: dict[str, Any] = {
        "title": title,
        "price": int(price),
        "currency": currency,
        "city": city,
    }
    if district:
        result["district"] = district
    if street:
        result["address"] = street
    if isinstance(rooms, int):
        result["rooms"] = rooms
    if isinstance(area, (int, float)):
        result["area"] = float(area)
    if isinstance(floor, int):
        result["floor"] = floor
    if isinstance(total_floors, int):
        result["totalFloors"] = total_floors
    if description:
        result["description"] = description
    if photos:
        result["photos"] = photos
    if phones:
        result["phones"] = phones
    return result


def map_from_json_ld(html: str, source_url: str) -> dict | None:
    for m in re.finditer(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>([\s\S]*?)</script>', html, re.I):
        try:
            data = json.loads(m.group(1))
            if not isinstance(data, dict):
                continue
            t = data.get("@type", "")
            types = t if isinstance(t, list) else ([t] if t else [])
            if not any(re.search(r"Apartment|Residence|Product|Offer|House|Accommodation", str(x), re.I) for x in types):
                continue
            name = data.get("name")
            addr = data.get("address") or {}
            city = addr.get("addressLocality") if isinstance(addr, dict) else None
            offers = data.get("offers")
            if isinstance(offers, list):
                offers = offers[0] if offers else {}
            if isinstance(offers, dict):
                price = offers.get("price")
                currency = str(offers.get("priceCurrency", "RUB")).upper()
            else:
                price = None
                currency = "RUB"
            if not name or not city or price is None:
                continue
            try:
                price = int(price)
            except (TypeError, ValueError):
                continue
            result: dict[str, Any] = {
                "title": str(name),
                "price": price,
                "currency": currency if currency in ("RUB", "USD", "EUR") else "RUB",
                "city": str(city),
            }
            if isinstance(addr, dict) and addr.get("streetAddress"):
                result["address"] = str(addr["streetAddress"])
            desc = data.get("description")
            if isinstance(desc, str) and desc:
                result["description"] = desc
                phones = extract_phones(desc)
                if phones:
                    result["phones"] = phones
            img = data.get("image")
            if isinstance(img, str):
                result["photos"] = [img]
            elif isinstance(img, list):
                result["photos"] = [x for x in img if isinstance(x, str)]
            return result
        except Exception:
            continue
    return None


def map_from_meta(html: str, source_url: str) -> dict | None:
    def match_meta(attr: str) -> str | None:
        r1 = re.search(fr'<meta[^>]+{attr}[^>]+content=["\']([^"\']+)["\'][^>]*>', html, re.I)
        r2 = re.search(fr'<meta[^>]+content=["\']([^"\']+)["\'][^>]+{attr}[^>]*>', html, re.I)
        return (r1 or r2).group(1) if (r1 or r2) else None

    def html_title() -> str | None:
        m = re.search(r"<title[^>]*>([\s\S]*?)</title>", html, re.I)
        return m.group(1) if m else None

    title_raw = match_meta('property="og:title"') or match_meta('name="title"') or html_title() or ""
    desc_raw = match_meta('property="og:description"') or match_meta('name="description"') or ""
    image = match_meta('property="og:image"')

    title = decode_entities(title_raw).strip()
    description = decode_entities(desc_raw).strip()

    price_m = re.search(r"(\d[\d\s\u00A0]*)\s*(?:руб\.?|₽|RUB)", title, re.I) or \
              re.search(r"(\d[\d\s\u00A0]*)\s*(?:руб\.?|₽|RUB)", description, re.I)
    price = parse_price(price_m.group(1)) if price_m else None

    addr_m = re.search(r"по адресу\s+(.+?),\s*\d+\s*этаж", title, re.I) or \
             re.search(r"по адресу\s+(.+?)\s+по цене", title, re.I)
    addr_parts = [s.strip() for s in (addr_m.group(1) if addr_m else "").split(",") if s.strip()]
    city = addr_parts[0] if addr_parts else infer_city_from_url(source_url)
    street = ", ".join(addr_parts[1:]) if len(addr_parts) > 1 else None

    if not title or price is None or not city:
        return None

    title = re.sub(r"\s*-\s*Домклик.*$", "", title, flags=re.I).strip() or title

    rooms_m = re.search(r"студи", title, re.I)
    rooms = 0 if rooms_m else None
    if rooms is None:
        rm = re.search(r"(\d+)\s*[-–]?\s*(?:комн|к\b)", title, re.I)
        if rm:
            rooms = int(rm.group(1))

    area_m = re.search(r"(\d+(?:[.,]\d+)?)\s*м²", title, re.I)
    area = float(area_m.group(1).replace(",", ".")) if area_m else None

    floor_m = re.search(r"(\d+)\s*этаж", title, re.I)
    floor = int(floor_m.group(1)) if floor_m else None

    phones = extract_phones(description)

    result: dict[str, Any] = {
        "title": title,
        "price": price,
        "currency": "RUB",
        "city": city,
    }
    if street:
        result["address"] = street
    if rooms is not None:
        result["rooms"] = rooms
    if area is not None:
        result["area"] = area
    if floor is not None:
        result["floor"] = floor
    if description:
        result["description"] = description
    if image:
        result["photos"] = [image]
    if phones:
        result["phones"] = phones
    return result


def parse_html(html: str, source_url: str) -> dict | None:
    state = extract_ssr_state(html)
    if state:
        r = map_from_ssr_state(state, source_url)
        if r:
            return r

    r = map_from_json_ld(html, source_url)
    if r:
        return r

    r = map_from_meta(html, source_url)
    if r:
        return r

    return None


# ---------------------------------------------------------------------------
# Step 1+2: curl_cffi
# ---------------------------------------------------------------------------

def try_curl_cffi(url: str) -> dict | None:
    try:
        from curl_cffi import requests as cffi_requests  # type: ignore
    except ImportError:
        print("[domclick_parser] curl_cffi not installed, skipping", file=sys.stderr)
        return None

    offer_id = extract_offer_id(url)
    proxy_url = os.environ.get("PARSER_PROXY_URL")
    proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None

    # Step 1: fetch the page directly
    try:
        resp = cffi_requests.get(
            url,
            headers=HEADERS,
            impersonate="chrome124",
            timeout=12,
            allow_redirects=True,
            **({"proxies": proxies} if proxies else {}),
        )
        html = resp.text
        if len(html) > 5000 and not looks_blocked(html):
            result = parse_html(html, url)
            if result:
                print(f"[domclick_parser] curl_cffi page parse success (len={len(html)})", file=sys.stderr)
                return result
        else:
            print(f"[domclick_parser] curl_cffi page blocked or empty (len={len(html)})", file=sys.stderr)
    except Exception as e:
        print(f"[domclick_parser] curl_cffi page fetch failed: {e}", file=sys.stderr)

    # Step 2: direct API endpoints
    if offer_id:
        parsed_url = urlparse(url)
        subdomain = parsed_url.hostname or "domclick.ru"
        endpoints = [
            f"https://domclick.ru/api/v2/offers/{offer_id}",
            f"https://domclick.ru/api/v1/card/{offer_id}",
            f"https://{subdomain}/api/v2/offers/{offer_id}",
        ]
        api_headers = {**HEADERS, "Accept": "application/json", "Content-Type": "application/json"}
        for endpoint in endpoints:
            try:
                resp = cffi_requests.get(
                    endpoint,
                    headers=api_headers,
                    impersonate="chrome124",
                    timeout=8,
                    **({"proxies": proxies} if proxies else {}),
                )
                if resp.status_code != 200:
                    continue
                data = resp.json()
                if not isinstance(data, dict):
                    continue
                # Wrap in SSR-like state for reuse
                inner = data.get("data", data)
                if not isinstance(inner, dict):
                    continue
                state = inner if inner.get("productCard") else {"productCard": inner}
                result = map_from_ssr_state(state, url)
                if result:
                    print(f"[domclick_parser] curl_cffi API success: {endpoint}", file=sys.stderr)
                    return result
            except Exception as e:
                print(f"[domclick_parser] API {endpoint} failed: {e}", file=sys.stderr)

    return None


# ---------------------------------------------------------------------------
# Step 3: Playwright async fallback
# ---------------------------------------------------------------------------

async def try_playwright(url: str) -> dict | None:
    try:
        from playwright.async_api import async_playwright  # type: ignore
    except ImportError:
        print("[domclick_parser] playwright not installed, skipping", file=sys.stderr)
        return None

    offer_id = extract_offer_id(url)
    captured_json: dict | None = None
    proxy_config = parse_proxy_url(os.environ.get("PARSER_PROXY_URL"))

    async with async_playwright() as p:
        launch_options: dict[str, Any] = {
            "headless": True,
            "args": [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--disable-infobars",
                "--window-size=1280,800",
            ],
        }
        if proxy_config:
            launch_options["proxy"] = proxy_config
        browser = await p.chromium.launch(**launch_options)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            locale="ru-RU",
            viewport={"width": 1280, "height": 800},
            extra_http_headers={
                "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "Referer": "https://domclick.ru/",
            },
        )

        # Stealth: remove webdriver fingerprint
        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['ru-RU','ru','en-US','en'] });
            Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
        """)

        page = await context.new_page()

        def on_response(response: Any) -> None:
            nonlocal captured_json
            if captured_json is not None:
                return
            resp_url = response.url
            ct = response.headers.get("content-type", "")
            is_api = (
                "/api/" in resp_url or (offer_id is not None and offer_id in resp_url)
            ) and "json" in ct
            if not is_api:
                return

            async def capture() -> None:
                nonlocal captured_json
                try:
                    data = await response.json()
                    if not isinstance(data, dict):
                        return
                    inner = data.get("data", data)
                    if not isinstance(inner, dict):
                        return
                    has_card_fields = any(
                        k in inner for k in ("productCard", "priceInfo", "objectInfo", "price")
                    )
                    if has_card_fields:
                        captured_json = inner
                        print(f"[domclick_parser] Playwright captured API: {resp_url}", file=sys.stderr)
                except Exception:
                    pass

            asyncio.ensure_future(capture())

        page.on("response", on_response)

        print(f"[domclick_parser] Playwright goto: {url}", file=sys.stderr)
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=15000)
        except Exception as e:
            print(f"[domclick_parser] goto failed: {e}", file=sys.stderr)

        print("[domclick_parser] Playwright: waiting for card content", file=sys.stderr)
        try:
            await page.wait_for_function(
                """() => {
                    const w = window;
                    if (w.__SSR_STATE__ && w.__SSR_STATE__.productCard) return true;
                    const priceEl =
                        document.querySelector('[data-testid="price-value"]') ||
                        document.querySelector('[class*="ObjectPrice"]') ||
                        document.querySelector('[class*="object-price"]') ||
                        document.querySelector('[itemprop="price"]');
                    if (priceEl && priceEl.textContent && priceEl.textContent.trim()) return true;
                    return false;
                }""",
                timeout=20000,
            )
        except Exception:
            pass  # take what we have

        # Give pending response handlers a tick to complete
        await asyncio.sleep(1.0)

        try:
            html = await page.content()
        except Exception as e:
            print(f"[domclick_parser] Playwright: page.content() failed: {e}", file=sys.stderr)
            html = ""
        print(f"[domclick_parser] Playwright: got HTML len={len(html)}", file=sys.stderr)

        await browser.close()

    if looks_blocked(html):
        return {"_blocked": True}

    # Priority 1: intercepted API JSON
    if captured_json is not None:
        state = captured_json if captured_json.get("productCard") else {"productCard": captured_json}
        result = map_from_ssr_state(state, url)
        if result:
            return result

    # Priority 2: full HTML parse
    return parse_html(html, url)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "INVALID_PAGE", "message": "URL argument required"}))
        sys.exit(1)

    url = sys.argv[1]

    # Step 1+2: curl_cffi (fast path)
    result = try_curl_cffi(url)
    if result:
        print(json.dumps(result, ensure_ascii=False))
        return

    # Step 3: Playwright fallback
    try:
        pw_result = asyncio.run(try_playwright(url))
    except Exception as e:
        message = str(e)
        print(f"[domclick_parser] Playwright fallback failed: {message}", file=sys.stderr)
        error = "TIMEOUT" if "Timeout" in message else "INVALID_PAGE"
        print(json.dumps({"error": error, "message": message}))
        sys.exit(4)

    if pw_result and pw_result.get("_blocked"):
        print(json.dumps({"error": "BLOCKED"}))
        sys.exit(2)
    if pw_result:
        print(json.dumps(pw_result, ensure_ascii=False))
        return

    print(json.dumps({"error": "INVALID_PAGE"}))
    sys.exit(3)


if __name__ == "__main__":
    main()
