import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, 999999));
await page.waitForTimeout(2000);

const stuck = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('[style*="opacity"]'));
  return all.filter(el => {
    const s = el.getAttribute('style') || '';
    // exact match: opacity:0 followed by ; or end
    return /opacity:\s*0[;\s"]|$opacity:\s*0$/m.test(s);
  }).map(el => ({
    tag: el.tagName,
    cls: (el.className || '').toString().slice(0, 200),
    text: (el.innerText || '').slice(0, 80),
    rect: { top: el.getBoundingClientRect().top, height: el.getBoundingClientRect().height },
    style: el.getAttribute('style')?.slice(0, 250),
  }));
});

await browser.close();
console.log(JSON.stringify({ stuckCount: stuck.length, stuck }, null, 2));
