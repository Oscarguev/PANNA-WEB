import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const stuck = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('[style*="opacity: 0"]'));
  return els.map(el => ({
    tag: el.tagName,
    cls: el.className?.slice(0, 150),
    text: el.innerText?.slice(0, 60),
    rect: el.getBoundingClientRect(),
    parent: el.parentElement?.className?.slice(0, 60),
  }));
});

// Scroll full page
for (let y = 0; y < 5000; y += 400) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(150);
}
await page.waitForTimeout(1000);

const stuckAfter = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('[style*="opacity: 0"]'));
  return els.map(el => ({
    tag: el.tagName,
    cls: el.className?.slice(0, 150),
    text: el.innerText?.slice(0, 60),
  }));
});

await browser.close();
console.log(JSON.stringify({ stuckInitial: stuck, stuckAfterFullScroll: stuckAfter }, null, 2));
