import { chromium } from 'playwright-chromium';
import fs from 'node:fs';

const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const OUT = '/tmp/pw-viewports';
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: '320x568',  width: 320,  height: 568,  device: 'iPhone SE' },
  { name: '390x844',  width: 390,  height: 844,  device: 'iPhone 14' },
  { name: '768x1024', width: 768,  height: 1024, device: 'iPad' },
  { name: '1024x768', width: 1024, height: 768,  device: 'iPad landscape' },
  { name: '1440x900', width: 1440, height: 900,  device: 'Desktop' },
  { name: '1920x1080', width: 1920, height: 1080, device: 'Full HD' },
];

const browser = await chromium.launch();
const results = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    serviceWorkers: 'block',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  page.on('pageerror', e => errors.push('PAGE: ' + e.message.slice(0, 200)));

  await page.goto(URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/${vp.name}-home.png`, fullPage: false });

  // Check key elements
  const checks = await page.evaluate(() => {
    const img = document.querySelector('main img, section img');
    const wordmark = document.body.innerText.includes('Panna');
    const manifesto = /contemporánea|contemporanea/i.test(document.body.innerText);
    const marquee = !!document.querySelector('[class*="animate-marquee"]');
    const backBtn = !!document.querySelector('button[aria-label="Volver arriba"]');
    return { heroImgSrc: img?.src?.slice(-40), wordmark, manifesto, marquee, backBtn };
  });

  // Check horizontal scroll
  const noHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

  results.push({ ...vp, errors: errors.length, errorList: errors.slice(0, 3), checks, noHorizontalScroll });
  await ctx.close();
}

await browser.close();
fs.writeFileSync(OUT + '/report.json', JSON.stringify(results, null, 2));
console.log('\n═══ 6 VIEWPORTS AUDIT ═══');
results.forEach(r => {
  const pass = r.errors === 0 && r.checks.heroImgSrc?.includes('bulldog') && r.checks.wordmark && r.checks.manifesto && r.checks.marquee && r.checks.backBtn && r.noHorizontalScroll;
  console.log(`${pass ? '✓' : '✗'} ${r.name.padEnd(12)} ${r.device.padEnd(18)} err=${r.errors} bulldog=${r.checks.heroImgSrc?.includes('bulldog') ? '✓' : '✗'} manifesto=${r.checks.manifesto ? '✓' : '✗'} marquee=${r.checks.marquee ? '✓' : '✗'} hScroll=${r.noHorizontalScroll ? '✓' : '✗'}`);
});
console.log('\nScreenshots in', OUT);