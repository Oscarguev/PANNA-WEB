import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();

// Con reduced-motion + override
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(URL + '/?motion=on', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const result = await page.evaluate(() => {
  const m = document.querySelector('[class*="animate-marquee"]');
  const overrideStyle = document.getElementById('motion-override-style');
  return {
    marqueeAnimName: m ? getComputedStyle(m).animationName : 'none',
    marqueeAnimDuration: m ? getComputedStyle(m).animationDuration : 'none',
    overrideStylePresent: !!overrideStyle,
    overrideCss: overrideStyle?.textContent?.slice(0, 200),
  };
});

// Scroll triggers
await page.evaluate(() => window.scrollTo(0, 999999));
await page.waitForTimeout(1500);
const afterScroll = await page.evaluate(() => ({
  transformsInView: document.querySelectorAll('[style*="transform"]').length,
}));

await browser.close();
console.log(JSON.stringify({ ...result, ...afterScroll }, null, 2));
