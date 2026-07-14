import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const debug = async (label) => {
  const data = await page.evaluate(() => ({
    scrollY: window.scrollY,
    innerWidth: window.innerWidth,
    heroVar: document.documentElement.style.getPropertyValue('--hero-scroll'),
    heroVarComputed: getComputedStyle(document.documentElement).getPropertyValue('--hero-scroll').trim(),
    inlineStyle: document.documentElement.getAttribute('style') || '',
  }));
  console.log(label, JSON.stringify(data));
};

await debug('initial   ');
await page.evaluate(() => window.scrollTo(0, 200));
await page.waitForTimeout(500);
await debug('scroll200 ');
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await debug('backTo0   ');
await page.evaluate(() => window.scrollTo(0, 500));
await page.waitForTimeout(500);
await debug('scroll500 ');

await browser.close();
