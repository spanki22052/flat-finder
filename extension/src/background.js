// Service worker: открывает вкладку фронтенда с закодированными данными.
// Никакой сетевой логики здесь нет — просто читаем настройку адреса фронтенда
// и формируем URL вида {frontendUrl}/import#data=<base64>.

const DEFAULT_FRONTEND_URL = 'http://127.0.0.1:5173';

async function getFrontendUrl() {
  const { frontendUrl } = await chrome.storage.sync.get('frontendUrl');
  return (frontendUrl || DEFAULT_FRONTEND_URL).replace(/\/+$/, '');
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'FF_OPEN_IMPORT') return undefined;

  (async () => {
    const base = await getFrontendUrl();
    // base64 может содержать "+", "/", "=" — без кодирования URLSearchParams
    // на стороне фронтенда сломает разбор (например, "+" превратится в пробел).
    const url = `${base}/import#data=${encodeURIComponent(message.payload)}`;
    await chrome.tabs.create({ url });
    sendResponse({ ok: true });
  })();

  return true;
});

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    const { frontendUrl } = await chrome.storage.sync.get('frontendUrl');
    if (!frontendUrl) {
      await chrome.storage.sync.set({ frontendUrl: DEFAULT_FRONTEND_URL });
    }
  }
});
