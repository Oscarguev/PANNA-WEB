import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  // Search any element with "marquee" in attributes/text
  const all = Array.from(document.querySelectorAll('*'));
  const m = all.filter(el => {
    const s = el.outerHTML.slice(0, 500);
    return /marquee/i.test(s);
  });
  return {
    count: m.length,
    firstHTML: m[0]?.outerHTML?.slice(0, 400),
    allSections: Array.from(document.querySelectorAll('section')).map(s => s.id || s.className?.slice(0, 30)),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
