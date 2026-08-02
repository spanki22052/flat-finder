const DEFAULT_FRONTEND_URL = 'http://127.0.0.1:5173';

const input = document.getElementById('frontendUrl');
const status = document.getElementById('status');
const saveBtn = document.getElementById('save');

function normalize(url) {
  return url.trim().replace(/\/+$/, '');
}

async function load() {
  const { frontendUrl } = await chrome.storage.sync.get('frontendUrl');
  input.value = frontendUrl || DEFAULT_FRONTEND_URL;
}

async function save() {
  const raw = input.value.trim();
  if (!raw) {
    status.textContent = 'Введите адрес фронтенда';
    status.style.color = '#ba1a1a';
    return;
  }
  try {
    new URL(raw);
  } catch {
    status.textContent = 'Некорректный URL';
    status.style.color = '#ba1a1a';
    return;
  }
  await chrome.storage.sync.set({ frontendUrl: normalize(raw) });
  status.textContent = 'Сохранено';
  status.style.color = '#4f7a52';
  setTimeout(() => {
    status.textContent = '';
  }, 2000);
}

saveBtn.addEventListener('click', save);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') save();
});

load();
