import { chromium } from 'playwright-chromium';
import fs from 'node:fs';

const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const OUT = '/tmp/pw-live-audit-2';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  serviceWorkers: 'block',
});
const page = await ctx.newPage();

await page.goto(URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2500); // intro

// Find marquee with proper selector
const marquee = await page.evaluate(() => {
  const selectors = [
    '.animate-marquee',
    '[class*="animate-marquee"]',
    '[class*="motion-safe\\:animate-marquee"]',
    'section[aria-label="Valores del restaurante"]',
  ];
  const found = {};
  selectors.forEach((s) => {
    try {
      const el = document.querySelector(s);
      found[s] = el ? { found: true, animation: getComputedStyle(el).animationName, transform: getComputedStyle(el).transform } : { found: false };
    } catch (e) {
      found[s] = { error: e.message };
    }
  });
  return found;
});

// Scroll to marquee position and screenshot
const marqueeBox = await page.evaluate(() => {
  const el = document.querySelector('section[aria-label="Valores del restaurante"]');
  if (!el) return null;
  el.scrollIntoView({ behavior: 'instant', block: 'center' });
  const r = el.getBoundingClientRect();
  return { top: r.top, height: r.height, width: r.width };
});
await page.waitForTimeout(500);
await page.screenshot({ path: OUT + '/marquee.png', fullPage: false });

// Check Manifesto RevealText
const manifesto = await page.evaluate(() => {
  // Look for "Cocina italiana contemporánea en Sonsonate"
  const all = Array.from(document.querySelectorAll('h2, h1, p'));
  const headline = all.find((el) => /contempornea|contemporánea/i.test(el.textContent || ''));
  if (!headline) return { found: false };
  // Check if any ancestor or sibling has overflow:hidden (mask reveal)
  const hasMask = !!document.querySelector('[style*="overflow: hidden"], .overflow-hidden');
  const overflowEls = document.querySelectorAll('.overflow-hidden').length;
  return { found: true, text: headline.textContent?.slice(0, 80), overflowEls };
});
await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('h2, h1, p'));
  const headline = all.find((el) => /contempornea|contemporánea/i.test(el.textContent || ''));
  if (headline) headline.scrollIntoView({ behavior: 'instant', block: 'center' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: OUT + '/manifesto.png', fullPage: false });

await browser.close();
fs.writeFileSync(OUT + '/report.json', JSON.stringify({ marquee, marqueeBox, manifesto }, null, 2));
console.log('OK');