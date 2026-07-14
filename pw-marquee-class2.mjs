import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app?motion=on';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('*')).filter(el => {
    const cs = getComputedStyle(el);
    return cs.animationName && cs.animationName !== 'none';
  });
  return {
    animatedCount: els.length,
    sample: els.slice(0, 5).map(el => ({
      tag: el.tagName,
      cls: (el.className || '').toString().slice(0, 200),
      animName: getComputedStyle(el).animationName,
    })),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
