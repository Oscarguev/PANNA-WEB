import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

const OUT = '/tmp/pw-audit/lh';
fs.mkdirSync(OUT, { recursive: true });

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

const URLS = [
  { name: 'home', url: 'http://localhost:4173/' },
  { name: 'menu', url: 'http://localhost:4173/menu' },
];

const result = {};
for (const u of URLS) {
  console.log(`\n=== ${u.name} ===`);
  const r = await lighthouse(u.url, {
    port: chrome.port,
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 },
  });
  const cat = r.lhr.categories;
  result[u.name] = {
    performance:    Math.round(cat.performance.score * 100),
    accessibility:  Math.round(cat.accessibility.score * 100),
    bestPractices:  Math.round(cat['best-practices'].score * 100),
    seo:            Math.round(cat.seo.score * 100),
    LCP: r.lhr.audits['largest-contentful-paint'].displayValue,
    CLS: r.lhr.audits['cumulative-layout-shift'].displayValue,
    TBT: r.lhr.audits['total-blocking-time'].displayValue,
    FCP: r.lhr.audits['first-contentful-paint'].displayValue,
    SI:  r.lhr.audits['speed-index'].displayValue,
  };
  fs.writeFileSync(`${OUT}/${u.name}.json`, r.report);
}
fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await chrome.kill();
