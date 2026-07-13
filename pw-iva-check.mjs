import { chromium } from 'playwright-chromium';
import fs from 'node:fs';

const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const OUT = '/tmp/pw-iva';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errors.push('PAGE: ' + e.message.slice(0, 200)));

await page.goto(URL + '/market', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const marketCheck = await page.evaluate(() => ({
  legend: !!document.body.innerText.match(/IVA\s+incluido/i),
}));

// Add first product to cart
const addBtn = page.locator('button:has-text("Añadir al carro")').first();
await addBtn.click();
await page.waitForTimeout(500);

// Open cart
const openCart = page.locator('button[aria-label*="Bolsa"], button[aria-label*="bolsa"], [aria-label*="Carrito"], [aria-label*="carrito"]').first();
await openCart.click().catch(() => page.evaluate(() => document.querySelectorAll('button').forEach(b => { if (b.textContent.match(/Bolsa|Carrito/i)) b.click(); })));
await page.waitForTimeout(1200);
await page.screenshot({ path: OUT + '/cart.png', fullPage: false });

const cartText = await page.evaluate(() => document.body.innerText);
const hasIvaLine = /13%\s*IVA|Impuestos/i.test(cartText);
const hasIncluido = /IVA\s+incluido/i.test(cartText);

// Find the subtotal and total numbers
const amounts = await page.evaluate(() => {
  const m = document.body.innerText.match(/Subtotal[^$]*\$?([\d.]+)[\s\S]*?Total[^$]*\$?([\d.]+)/);
  return m ? { subtotal: m[1], total: m[2] } : null;
});

await browser.close();
console.log(JSON.stringify({
  marketLegend: marketCheck.legend,
  cartHasIvaLine: hasIvaLine,
  cartHasIncluido: hasIncluido,
  amounts,
  errors: errors.slice(0, 3),
}, null, 2));
