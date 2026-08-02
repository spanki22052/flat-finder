// Content script: плавающая кнопка "+" на страницах объявлений.
// По клику собирает HTML страницы и открывает /import на фронтенде
// с закодированными данными — весь разбор делает бэкенд (parse-html).

(function () {
  'use strict';

  const SOURCES = [
    { id: 'avito', test: (host) => /(^|\.)avito\.ru$/.test(host) },
    { id: 'cian', test: (host) => /(^|\.)cian\.ru$/.test(host) },
    { id: 'domclick', test: (host) => /(^|\.)domclick\.(ru|com)$/.test(host) },
    { id: 'yandex', test: (host) => /(^|\.)realty\.(yandex\.ru|ya\.ru)$/.test(host) },
  ];

  function detectSource(hostname) {
    const found = SOURCES.find((s) => s.test(hostname));
    return found ? found.id : null;
  }

  // Грубая, но достаточная эвристика: страница конкретного объявления,
  // а не листинг/поиск/главная.
  function looksLikeListingPage(source, pathname) {
    switch (source) {
      case 'avito':
        return /_\d{6,}(?:[/?#]|$)/.test(pathname);
      case 'cian':
        return /\/(rent|sale)\/(flat|suburban|commercial)\/\d+/.test(pathname);
      case 'domclick':
        return /\/card\//.test(pathname);
      case 'yandex':
        return /\/offer\//.test(pathname);
      default:
        return false;
    }
  }

  const source = detectSource(window.location.hostname);
  if (!source) return;
  if (!looksLikeListingPage(source, window.location.pathname)) return;

  function encodePayload(payload) {
    const json = JSON.stringify(payload);
    // unescape/encodeURIComponent пара — безопасно кодирует UTF-8 в base64.
    return btoa(unescape(encodeURIComponent(json)));
  }

  async function revealPhoneNumbers(source) {
    if (source !== 'domclick') return;
    
    const phoneButtons = Array.from(document.querySelectorAll('a[href^="tel:"]')).filter(
      (a) => a.textContent.includes('Показать телефон') || a.querySelector('.btn-text-398-18-0-3')
    );
    
    if (phoneButtons.length === 0) return;
    
    for (const btn of phoneButtons) {
      if (!btn.textContent.match(/\d{3}.*\d{3}.*\d{2}.*\d{2}/)) {
        btn.click();
      }
    }
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  function setButtonState(btn, state) {
    btn.dataset.state = state;
    btn.disabled = state === 'busy';
    btn.setAttribute(
      'aria-label',
      state === 'busy'
        ? 'Flat Finder: собираем данные…'
        : state === 'done'
          ? 'Flat Finder: отправлено'
          : state === 'error'
            ? 'Flat Finder: ошибка, нажмите ещё раз'
            : 'Добавить в Flat Finder',
    );
  }

  function createButton() {
    const btn = document.createElement('button');
    btn.id = 'ff-import-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Добавить в Flat Finder');
    btn.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
      + '<path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
      + '</svg>';
    setButtonState(btn, 'idle');

    btn.addEventListener('click', async () => {
      if (btn.dataset.state === 'busy') return;
      setButtonState(btn, 'busy');
      try {
        await revealPhoneNumbers(source);
        const payload = {
          source,
          sourceUrl: window.location.href,
          html: document.documentElement.outerHTML,
        };
        const encoded = encodePayload(payload);
        const response = await chrome.runtime.sendMessage({
          type: 'FF_OPEN_IMPORT',
          payload: encoded,
        });
        if (!response?.ok) throw new Error('no response');
        setButtonState(btn, 'done');
        setTimeout(() => setButtonState(btn, 'idle'), 2000);
      } catch (err) {
        setButtonState(btn, 'error');
        setTimeout(() => setButtonState(btn, 'idle'), 2500);
      }
    });

    document.body.appendChild(btn);
  }

  if (!document.getElementById('ff-import-btn')) {
    createButton();
  }
})();
