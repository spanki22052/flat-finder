import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (msg) => console.log('CONSOLE:', msg.text()));
page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));

await page.goto('http://localhost:5173/register');
await page.waitForTimeout(500);

const uname = 'dbgtest' + Date.now();
await page.fill('input[placeholder="Ваше имя"]', 'Debug Tester');
await page.fill('input[placeholder="Логин"]', uname);
await page.fill('input[placeholder="Пароль"]', 'password123');
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);

console.log('URL after register:', page.url());

await page.goto('http://localhost:5173/profile');
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/profile-desktop.png', fullPage: true });
console.log('desktop screenshot saved');

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/profile-mobile.png', fullPage: true });
console.log('mobile screenshot saved');

await browser.close();
