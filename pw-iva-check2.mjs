import { chromium } from 'playwright-chromium';
import fs from 'node:fs';

const URL = 'https://frontend-1yywut9bd-oscarguevs-projects.vercel.app';
const OUT = '/tmp/pw-iva2';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errors.push('PAGE: ' + e.message.slice(0, 200)));

await page.goto(URL + '/market', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const marketLegend = await page.evaluate(() => /IVA\s+incluido/i.test(document.body.innerText));

const addBtn = page.locator('button:has-text("Añadir al carro")').first();
await addBtn.click();
await page.waitForTimeout(500);

await page.evaluate(() => {
  document.querySelectorAll('button').forEach(b => {
    if (/bolsa|carrito/i.test(b.getAttribute('aria-label') || '')) b.click();
  });
});
await page.waitForTimeout(1500);
await page.screenshot({ path: OUT + '/cart.png', fullPage: false });

const cartText = await page.evaluate(() => document.body.innerText);
const hasIvaLine = /13%\s*IVA|Impuestos/i.test(cartText);
const hasIncluido = /IVA\s+incluido/i.test(cartText);

const amounts = await page.evaluate(() => {
  const m = document.body.innerText.match(/Subtotal[^$]*\$?([\d.]+)[\s\S]*?Total[^$]*\$?([\d.]+)/);
  return m ? { subtotal: m[1], total: m[2] } : null;
});

await browser.close();
console.log(JSON.stringify({
  deploy: URL,
  marketLegend,
  cartHasIvaLine: hasIvaLine,
  cartHasIncluido: hasIncluido,
  amounts,
  errors: errors.slice(0, 3),
}, null, 2));
