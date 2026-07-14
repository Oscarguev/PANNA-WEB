import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
// scroll to absolute bottom
await page.evaluate(() => window.scrollTo(0, 999999));
await page.waitForTimeout(2000);

const stuck = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('[style*="opacity: 0"]'));
  return all.filter(el => {
    const s = el.getAttribute('style') || '';
    return /opacity:\s*0(\D|$)/.test(s);
  }).map(el => ({
    tag: el.tagName,
    cls: (el.className || '').toString().slice(0, 200),
    text: (el.innerText || '').slice(0, 80),
    parentCls: (el.parentElement?.className || '').toString().slice(0, 80),
    rect: el.getBoundingClientRect(),
    style: el.getAttribute('style')?.slice(0, 250),
  }));
});

await browser.close();
console.log(JSON.stringify({ scrollY: 'max', stuck }, null, 2));
