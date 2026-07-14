import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app?motion=on';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  const m = document.querySelector('[class*="marquee"]');
  return {
    found: !!m,
    className: m ? m.className : null,
    attributes: m ? Array.from(m.attributes).map(a => `${a.name}=${a.value}`) : null,
    outerHTML: m ? m.outerHTML.slice(0, 300) : null,
    overrideEl: !!document.getElementById('motion-override-style'),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
