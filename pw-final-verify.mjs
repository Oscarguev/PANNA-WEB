import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();

// Test 3 escenarios
const cases = [
  { name: 'normal',            reduce: false, override: false },
  { name: 'reducedMotion',     reduce: true,  override: false },
  { name: 'reduced+override',  reduce: true,  override: true  },
];

const results = [];

for (const c of cases) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...(c.reduce ? { reducedMotion: 'reduce' } : {}),
  });
  const page = await ctx.newPage();
  const url = URL + '/' + (c.override ? '?motion=on' : '');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const data = await page.evaluate(() => {
    const m = document.querySelector('[class*="animate-marquee"]');
    const animatedEls = Array.from(document.querySelectorAll('*')).filter(el => {
      const a = getComputedStyle(el).animationName;
      return a && a !== 'none';
    });
    return {
      marqueeExists: !!m,
      marqueeAnim: m ? getComputedStyle(m).animationName : 'none',
      marqueeDur:  m ? getComputedStyle(m).animationDuration : 'none',
      totalAnimated: animatedEls.length,
    };
  });

  await ctx.close();
  results.push({ case: c.name, ...data });
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
