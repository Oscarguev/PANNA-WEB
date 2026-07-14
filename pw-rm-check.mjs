import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();

// Test 1: default (no reduced motion)
const ctx1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p1 = await ctx1.newPage();
await p1.goto(URL + '/', { waitUntil: 'networkidle' });
await p1.waitForTimeout(2500);
const r1 = await p1.evaluate(() => ({
  prefersReducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  marqueeAnim: (() => { const m = document.querySelector('[class*="animate-marquee"]'); return m ? getComputedStyle(m).animationName : 'none'; })(),
  heroImgOpacity: (() => { const i = document.querySelector('#hero img, section img'); return i ? getComputedStyle(i).opacity : 'none'; })(),
  wordmarkOpacity: (() => { const h = document.querySelector('h1'); return h ? getComputedStyle(h).opacity : 'none'; })(),
}));
await ctx1.close();

// Test 2: with prefers-reduced-motion: reduce
const ctx2 = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
const p2 = await ctx2.newPage();
await p2.goto(URL + '/', { waitUntil: 'networkidle' });
await p2.waitForTimeout(2500);
const r2 = await p2.evaluate(() => ({
  prefersReducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  marqueeAnim: (() => { const m = document.querySelector('[class*="animate-marquee"]'); return m ? getComputedStyle(m).animationName : 'none'; })(),
  heroImgOpacity: (() => { const i = document.querySelector('#hero img, section img'); return i ? getComputedStyle(i).opacity : 'none'; })(),
  wordmarkOpacity: (() => { const h = document.querySelector('h1'); return h ? getComputedStyle(h).opacity : 'none'; })(),
}));
await ctx2.close();

await browser.close();
console.log(JSON.stringify({ normal: r1, reducedMotion: r2 }, null, 2));
