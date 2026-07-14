import { chromium } from 'playwright-chromium';
import fs from 'node:fs';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const OUT = '/tmp/motion-visual';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errors.push('PAGE: ' + e.message.slice(0, 200)));

await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Capture at scroll positions
const positions = [
  { name: '00-top',    y: 0 },
  { name: '01-800',    y: 800 },
  { name: '02-1600',   y: 1600 },
  { name: '03-2400',   y: 2400 },
  { name: '04-3200',   y: 3200 },
  { name: '05-4000',   y: 4000 },
  { name: '06-5000',   y: 5000 },
  { name: '07-max',    y: 99999 },
];

const log = [];

for (const p of positions) {
  await page.evaluate((y) => window.scrollTo(0, y), p.y);
  await page.waitForTimeout(800);
  
  const audit = await page.evaluate(() => {
    return {
      scrollY: window.scrollY,
      docHeight: document.documentElement.scrollHeight,
      opacityZeroExact: Array.from(document.querySelectorAll('[style*="opacity: 0"]')).filter(el => {
        const s = el.getAttribute('style') || '';
        return /opacity:\s*0(\D|$)/.test(s);
      }).length,
      opacityZeroLenient: document.querySelectorAll('[style*="opacity: 0"]').length,
      transforms: document.querySelectorAll('[style*="transform"]').length,
      marqueeAnimated: (() => {
        const m = document.querySelector('[class*="animate-marquee"]');
        return m ? getComputedStyle(m).animationName : 'none';
      })(),
      heroParallaxVar: getComputedStyle(document.documentElement).getPropertyValue('--hero-scroll'),
    };
  });
  
  await page.screenshot({ path: `${OUT}/${p.name}.png` });
  log.push({ ...p, ...audit });
}

await browser.close();
console.log(JSON.stringify({ log, errors: errors.slice(0, 3) }, null, 2));
