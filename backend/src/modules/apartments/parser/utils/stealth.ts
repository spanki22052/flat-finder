import type { Browser, BrowserContext, LaunchOptions } from 'rebrowser-playwright';

async function loadPlaywright(): Promise<typeof import('rebrowser-playwright')> {
  return import('rebrowser-playwright');
}

/**
 * Инжектирует stealth-патчи в каждый новый контекст.
 * Вызывается для каждого контекста отдельно — нет глобального синглтона.
 */
async function applyStealth(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    // Strip navigator.webdriver
    if ('webdriver' in navigator) {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    }

    // Fake plugins length
    Object.defineProperty(navigator, 'plugins', {
      get: () => {
        const arr = [1, 2, 3, 4, 5];
        Object.defineProperty(arr, 'item', { value: (i: number) => arr[i] ?? null });
        return arr;
      },
    });

    // Fake languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['ru-RU', 'ru', 'en-US', 'en'],
    });

    // Fake hardwareConcurrency
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });

    // Fake deviceMemory
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });

    // Patch WebGL vendor / renderer
    const getParam = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (this: WebGLRenderingContext, param: number) {
      if (param === 37445) return 'Intel Inc.';
      if (param === 37446) return 'Intel(R) Iris(TM) Plus Graphics 640';
      return getParam.call(this, param);
    };

    // Canvas fingerprint noise — slight random offset so toDataURL changes per instance
    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (type?: string, quality?: unknown) {
      const ctx = this.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, this.width || 1, this.height || 1);
        // Добавляем невидимый шум в последний канал последнего пикселя
        if (imageData.data.length >= 4) {
          imageData.data[imageData.data.length - 1] = (imageData.data[imageData.data.length - 1] + 1) & 0xff;
          ctx.putImageData(imageData, 0, 0);
        }
      }
      return origToDataURL.call(this, type, quality as number | undefined);
    };

    // Battery API stub — предотвращает утечку через navigator.getBattery()
    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<unknown> }).getBattery = () =>
        Promise.resolve({
          charging: true,
          chargingTime: 0,
          dischargingTime: Infinity,
          level: 1.0,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
        });
    }

    // Media devices stub — скрываем реальное количество устройств
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const origEnumerate = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
      navigator.mediaDevices.enumerateDevices = () =>
        origEnumerate().then((devices) =>
          devices.map((d) => ({
            deviceId: d.deviceId ? 'default' : '',
            groupId: d.groupId ? 'default' : '',
            kind: d.kind,
            label: '',
            toJSON: d.toJSON?.bind(d) ?? (() => ({})),
          } as MediaDeviceInfo)),
        );
    }

    // Permissions — не выдаём состояние Notification
    const origQuery = navigator.permissions?.query?.bind(navigator.permissions);
    if (origQuery) {
      navigator.permissions.query = (desc: PermissionDescriptor) => {
        if ((desc as { name: string }).name === 'notifications') {
          return Promise.resolve({ state: 'prompt', onchange: null, addEventListener: () => undefined, removeEventListener: () => undefined, dispatchEvent: () => false } as unknown as PermissionStatus);
        }
        return origQuery(desc);
      };
    }

    // Chrome runtime — чтобы сайты видели window.chrome
    const w = window as unknown as { chrome?: unknown };
    if (!w.chrome) {
      w.chrome = {
        runtime: {
          connect: () => undefined,
          sendMessage: () => undefined,
          onMessage: { addListener: () => undefined, removeListener: () => undefined },
        },
        loadTimes: () => ({}),
        csi: () => ({}),
        app: {},
      };
    }
  });
}

export interface StealthLaunchOptions {
  headless?: boolean;
  proxyUrl?: string;
  userAgent?: string;
  locale?: string;
  timezoneId?: string;
  channel?: 'chrome';
}

export async function launchStealthBrowser(opts: StealthLaunchOptions = {}): Promise<Browser> {
  const { chromium } = await loadPlaywright();

  const launchOptions: LaunchOptions = {
    headless: opts.headless ?? true,
    ...(opts.channel ? { channel: opts.channel } : {}),
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-web-security',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu-sandbox',
      '--window-size=1440,900',
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
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  });

  // Применяем ручные stealth-патчи к каждому новому контексту
  await applyStealth(context);

  // fingerprint-injector: инжектируем реальный fingerprint Chrome/Windows
  try {
    const { FingerprintGenerator } = await import('fingerprint-generator');
    const { FingerprintInjector } = await import('fingerprint-injector');

    const generator = new FingerprintGenerator({
      browsers: [{ name: 'chrome', minVersion: 130 }],
      operatingSystems: ['windows'],
      locales: ['ru-RU', 'en-US'],
      devices: ['desktop'],
    });

    const { fingerprint, headers } = generator.getFingerprint();
    const injector = new FingerprintInjector();
    // Cast needed: fingerprint-injector types against playwright-core, we use rebrowser-playwright
    await injector.attachFingerprintToPlaywright(context as unknown as Parameters<typeof injector.attachFingerprintToPlaywright>[0], { fingerprint, headers });
  } catch {
    // fingerprint-injector недоступен — продолжаем без него
  }

  return context;
}
