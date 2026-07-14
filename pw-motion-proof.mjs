import { chromium } from 'playwright-chromium';
import fs from 'node:fs';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const OUT = '/tmp/motion-proof';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Page load
await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500); // capture mid-animation
await page.screenshot({ path: `${OUT}/00-load-500ms.png` });

await page.waitForTimeout(3000); // settled
await page.screenshot({ path: `${OUT}/01-settled.png` });

// Capture marquee frames to prove it's animating
for (let i = 0; i < 4; i++) {
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/marquee-${i}.png`, clip: { x: 0, y: 700, width: 1440, height: 100 } });
}

// Scroll to trigger parallax in story/restaurantintro
await page.evaluate(() => {
  const story = document.getElementById('story') || document.getElementById('intro');
  if (story) story.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/02-story-scroll.png` });

// Verify hero parallax CSS var changes
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(200);
const heroScroll0 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--hero-scroll').trim());
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(300);
const heroScroll400 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--hero-scroll').trim());

// Scroll Reveal in action — capture before/after at scroll
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
const sigDishesBefore = await page.evaluate(() => {
  const el = document.getElementById('signature');
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const revealEls = Array.from(el.querySelectorAll('[style*="opacity"], [style*="transform"]'));
  return { rectTop: rect.top, revealCount: revealEls.length };
});

await page.evaluate(() => {
  const sig = document.getElementById('signature');
  if (sig) sig.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(1500);
const sigDishesAfter = await page.evaluate(() => {
  const el = document.getElementById('signature');
  if (!el) return null;
  const revealEls = Array.from(el.querySelectorAll('[style*="opacity"], [style*="transform"]'));
  return {
    rectTop: el.getBoundingClientRect().top,
    visibleReveals: revealEls.filter(e => {
      const o = parseFloat((e.style.opacity || '1'));
      return o > 0.5;
    }).length,
    totalReveals: revealEls.length,
  };
});

await browser.close();
console.log(JSON.stringify({
  heroParallaxScroll0: heroScroll0,
  heroParallaxScroll400: heroScroll400,
  sigDishesBefore,
  sigDishesAfter,
}, null, 2));
