import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app?motion=on';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  const m = document.querySelector('[class*="animate-marquee"]');
  return {
    className: m?.className,
    classList: Array.from(m?.classList || []),
    computedAnimation: m ? getComputedStyle(m).animation : 'none',
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
