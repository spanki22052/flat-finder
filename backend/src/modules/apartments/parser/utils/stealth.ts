import type { Browser, BrowserContext, LaunchOptions } from 'playwright';

let playwrightModule: typeof import('playwright') | null = null;
let stealthApplied = false;

async function loadPlaywright(): Promise<typeof import('playwright')> {
  if (!playwrightModule) {
    playwrightModule = await import('playwright');
  }
  return playwrightModule;
}

async function applyStealth(context: BrowserContext): Promise<void> {
  if (stealthApplied) return;

  await context.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>;
    // Strip navigator.webdriver
    if ('webdriver' in navigator) {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    }
    // Fake plugins length
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });
    // Fake languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['ru-RU', 'ru', 'en'],
    });
    // Patch WebGL vendor
    const getParam = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (this: WebGLRenderingContext, param: number) {
      if (param === 37445) return 'Intel Inc.';
      if (param === 37446) return 'Intel Iris OpenGL Engine';
      return getParam.call(this, param);
    };
    // Permissions
    if (w.Notification && typeof (Notification as unknown as { permission?: unknown }).permission !== 'string') {
      Object.defineProperty(Notification, 'permission', { get: () => 'default' });
    }
    // Chrome runtime
    (window as unknown as { chrome?: unknown }).chrome = { runtime: {} };
  });

  stealthApplied = true;
}

export interface StealthLaunchOptions {
  headless?: boolean;
  proxyUrl?: string;
  userAgent?: string;
  locale?: string;
  timezoneId?: string;
}

export async function launchStealthBrowser(opts: StealthLaunchOptions = {}): Promise<Browser> {
  const { chromium } = await loadPlaywright();

  const launchOptions: LaunchOptions = {
    headless: opts.headless ?? true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-web-security',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  };

  if (opts.proxyUrl) {
    const proxyUrl = new URL(opts.proxyUrl);
    launchOptions.proxy = {
      server: `${proxyUrl.protocol}//${proxyUrl.host}`,
      ...(proxyUrl.username ? { username: decodeURIComponent(proxyUrl.username) } : {}),
      ...(proxyUrl.password ? { password: decodeURIComponent(proxyUrl.password) } : {}),
    };
  }

  return chromium.launch(launchOptions);
}

export async function createStealthContext(
  browser: Browser,
  opts: StealthLaunchOptions = {},
): Promise<BrowserContext> {
  const context = await browser.newContext({
    userAgent: opts.userAgent,
    locale: opts.locale ?? 'ru-RU',
    timezoneId: opts.timezoneId ?? 'Europe/Moscow',
    viewport: { width: 1440, height: 900 },
    extraHTTPHeaders: {
      'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
    },
  });

  await applyStealth(context);
  return context;
}