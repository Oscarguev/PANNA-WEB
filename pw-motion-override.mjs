import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();

// Test 1: con reduced-motion, sin override
const ctx1 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p1 = await ctx1.newPage();
await p1.goto(URL + '/', { waitUntil: 'networkidle' });
await p1.waitForTimeout(2500);
await p1.evaluate(() => window.scrollTo(0, 999999));
await p1.waitForTimeout(1500);
const r1 = await p1.evaluate(() => ({
  marqueeAnim: (() => { const m = document.querySelector('[class*="animate-marquee"]'); return m ? getComputedStyle(m).animationName : 'none'; })(),
  transformsInView: document.querySelectorAll('[style*="transform"]').length,
}));
await ctx1.close();

// Test 2: con reduced-motion + override ?motion=on
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p2 = await ctx2.newPage();
await p2.goto(URL + '/?motion=on', { waitUntil: 'networkidle' });
await p2.waitForTimeout(2500);
await p2.evaluate(() => window.scrollTo(0, 999999));
await p2.waitForTimeout(1500);
const r2 = await p2.evaluate(() => ({
  marqueeAnim: (() => { const m = document.querySelector('[class*="animate-marquee"]'); return m ? getComputedStyle(m).animationName : 'none'; })(),
  transformsInView: document.querySelectorAll('[style*="transform"]').length,
}));
await ctx2.close();

await browser.close();
console.log(JSON.stringify({
  reducedMotionOnly: r1,
  reducedMotion_with_override: r2,
}, null, 2));
