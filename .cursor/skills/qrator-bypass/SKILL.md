---
name: qrator-bypass
description: Legally check and technically bypass Qrator anti-bot protection (JS challenge, qrator_jsid cookie, TLS/HTTP2 fingerprinting) when a parser strategy hits a 403/block. Use when a site returns Qrator block page, "Попробуйте зайти позже", Guru Meditation error, or looksBlocked() triggers on a Qrator-protected domain (leroymerlin.ru, mts.ru, magnit.ru, auchan.ru, citilink.ru, etc). Integrates with this repo's parser subsystem (super-parser skill).
disable-model-invocation: true
---

# Qrator Bypass

## Legal check first (always do this before any bypass)

1. Check for official API / RSS / data export — often cheaper than bypassing.
2. Ask the site owner for parsing permission or IP whitelist if this is B2B/recurring.
3. Respect `robots.txt` and ToS; throttle request rate regardless of method used.
4. Browser automation should only touch the user's own account / explicitly allowed flows — never mass-scrape behind auth without consent.

If none of the above apply and scraping public listing pages is the only option, proceed to the technical section.

## How Qrator detects you

- **JS challenge**: intermediate page runs JS, computes a value, sets `qrator_jsid` cookie, then redirects to real content. No JS execution → no cookie → 403/block page.
- **Network fingerprint (before JS even runs)**: HTTP/1.1 vs HTTP/2, JA3/JA4 TLS handshake, Docker/datacenter IP ranges. This is why plain `requests`/`curl` and cloud-VM/Docker origins get blocked even with perfect headers.
- **Browser automation traces**: `navigator.webdriver`, `window.cdc_*` properties, missing/mismatched CDP behavior (`Runtime.enable` leak). Classic Selenium is flagged instantly.
- **Cookie lifetime**: `qrator_jsid` typically expires ~5–30 min, must be refreshed periodically.

## Bypass ladder (try in this order)

### 1. Check if the specific page even needs JS
Some Qrator-protected sites only guard specific routes (e.g. product pages) while category/listing pages are plain. Test with a bare HTTP client first:

```bash
curl -sI "https://target.ru/page" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36"
```

If you get real content or a redirect (not a Qrator block page), light-fetch is enough — no browser needed.

### 2. Headful browser + RU-residential proxy (most reliable per forum consensus)
Headless Chromium gets blocked far more often than headful. Combine with `channel: 'chrome'` (real Chrome binary, not Chromium — beats TLS/JA3 fingerprint checks) and a residential proxy in the target's country:

```ts
const browser = await chromium.launch({
  channel: 'chrome',
  headless: false, // PARSER_HEADLESS=false
  proxy: { server: process.env.PARSER_PROXY_URL },
});
```

Datacenter/cloud-VM IPs (including Docker default networking) get pre-blocked at the network layer regardless of browser stealth — this is the #1 cause of "works locally, fails on server."

### 3. Extract `qrator_jsid` once, reuse in plain HTTP session
Since the JS challenge only needs to run once per cookie lifetime:

```ts
// One-time: solve challenge with a real browser
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await randomDelay(3000, 5000); // let JS challenge finish
const cookies = (await context.cookies()).filter(c => c.name.startsWith('qrator'));

// Reuse: plain HTTP requests with those cookies until they expire (~5-30 min)
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
await lightFetch(nextUrl, { headers: { Cookie: cookieHeader, 'User-Agent': sameUaAsChallenge } });
```

Refresh the cookie proactively (e.g. every 5 min) rather than waiting for a 403, and keep the User-Agent identical between the challenge-solving browser and the reused HTTP session — Qrator ties the cookie to the UA.

### 4. If channel:'chrome' + residential proxy still fails
- Try `REBROWSER_PATCHES_RUNTIME_FIX_MODE=alwaysIsolated` (see `super-parser` skill) — kills the `Runtime.enable` CDP leak.
- Verify `fingerprint-injector` profile is internally consistent (UA, WebGL, canvas all match one generated fingerprint, not mixed).
- Add human-like behavior: scroll, mouse movement, `randomDelay(2000, 3000)` before/after the challenge redirect.
- Last resort mentioned on forums: resolve the site's real origin IP (bypassing a CDN/WAF-only Qrator deployment) via historical DNS lookup (e.g. viewdns.info) and hit it directly with the `Host` header set — only works when Qrator sits in front of the CDN, not embedded app-side, and only if ToS-permitted.

## Integration with this repo

Follow the `super-parser` skill's strategy pattern. In `heavyParse`, apply the ladder above:

```ts
private async heavyParse(url: string): Promise<ParsedListing> {
  const proxyUrl = process.env.PARSER_PROXY_URL; // must be RU-residential for RU targets
  const browser = await launchStealthBrowser({
    headless: process.env.PARSER_HEADLESS !== 'false', // set false for Qrator targets
    channel: 'chrome',
    ...(proxyUrl ? { proxyUrl } : {}),
  });
  try {
    const context = await createStealthContext(browser, { ...(proxyUrl ? { proxyUrl } : {}) });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await randomDelay(2000, 4000); // let qrator_jsid challenge resolve

    const html = await page.content();
    if (looksBlocked(html)) throw new ParserBlockedError('Qrator: блокировка после challenge');
    // ... extract as usual, or cache context.cookies() for cookie-reuse mode
  } finally {
    await browser.close();
  }
}
```

Do not hardcode this per-site — only apply the headful + `channel: 'chrome'` combo for hostnames known to run Qrator (check response headers for `Server: qrator` or the block page copy: "Попробуйте зайти на ... позже").

## Sources

- [A-Parser forum: Qrator bypass request](https://a-parser.com/threads/8649/) — plain `Net::HTTP` sufficed on some Qrator-protected pages (top-santehnika.ru, magnit.ru express) once headers matched a real browser.
- [ZennoClub forum: MTS lk.mts.ru Qrator](https://zenno.club/discussion/threads/obkhod-zashchity-qrator.101881/) — cookie/header copy from real browser devtools into automation as a workaround.
- [Habr Q&A: Леруа Мерлен Qrator + Selenium](https://qna.habr.com/q/1206176) — `qrator_jsid` must be paired with matching User-Agent; cookie expires ~30 min, needs refresh automation.
- [excelvba.ru: Qrator/Incapsula/CloudFlare bypass manual](https://excelvba.ru/programmes/Parser/manuals/errors/protection) — leroymerlin.ru case; origin-IP-direct trick when Qrator is CDN-only.
- [NeuroAnswers: Qrator in Docker containers](https://neuroanswers.net/c/devops/q/how-to-bypass-qrator-blocking-docker-containers) — HTTP/2 + JA3 fingerprint + non-datacenter IP required; recommends `nodriver` over `undetected-chromedriver`.
