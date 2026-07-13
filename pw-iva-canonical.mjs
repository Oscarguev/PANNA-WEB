import { chromium } from 'playwright-chromium';

const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  serviceWorkers: 'block',
});
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errors.push('PAGE: ' + e.message.slice(0, 200)));

await page.goto(URL + '/market', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const info = await page.evaluate(async () => {
  const r = await fetch('/index.html', { cache: 'no-store' });
  const txt = await r.text();
  const m = txt.match(/index-([A-Za-z0-9_-]+)\.js/);
  return { indexJs: m?.[1] || 'unknown', hasLegend: /IVA\s+incluido/i.test(document.body.innerText) };
});

await browser.close();
console.log(JSON.stringify(info, null, 2));
