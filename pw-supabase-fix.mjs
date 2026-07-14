import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errors.push('PAGE: ' + e.message.slice(0, 200)));

await page.goto(URL + '/market', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const marketCount = await page.evaluate(() => document.querySelectorAll('article').length);

// Open product detail (test favoritos query path)
const favButton = await page.locator('button:has-text("Detalles")').first();
const hasFavButton = await favButton.count();

await browser.close();
console.log(JSON.stringify({
  marketArticleCount: marketCount,
  favButtonsAvailable: hasFavButton,
  errors: errors.slice(0, 3),
}, null, 2));
