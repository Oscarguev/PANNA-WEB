import { chromium } from 'playwright-chromium';
import fs from 'node:fs';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const OUT = '/tmp/marquee-deep';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// Find the marquee element rect
const rect = await page.evaluate(() => {
  const m = document.querySelector('[class*="animate-marquee"]');
  if (!m) return null;
  const r = m.getBoundingClientRect();
  const cs = getComputedStyle(m);
  const inner = m.innerText?.slice(0, 200);
  return {
    top: r.top, height: r.height, width: r.width,
    scrollHeight: m.scrollHeight,
    animationName: cs.animationName,
    animationDuration: cs.animationDuration,
    animationIterationCount: cs.animationIterationCount,
    inner,
    childCount: m.children.length,
  };
});
console.log('MARQUEE:', JSON.stringify(rect, null, 2));

// Full screenshot of marquee region
if (rect) {
  await page.screenshot({
    path: `${OUT}/marquee-full.png`,
    clip: { x: 0, y: rect.top - 50, width: 1440, height: rect.height + 100 },
  });
  // capture 3 frames at different times
  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${OUT}/marquee-t${i}.png`,
      clip: { x: 0, y: rect.top - 50, width: 1440, height: rect.height + 100 },
    });
  }
}

// Verify Manifesto is present
const manifesto = await page.evaluate(() => {
  const m = /contemporánea|contemporanea/i.test(document.body.innerText);
  return { present: m };
});
console.log('MANIFESTO:', JSON.stringify(manifesto));

await browser.close();
