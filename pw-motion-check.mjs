import { chromium } from 'playwright-chromium';
const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
page.on('pageerror', e => errors.push('PAGE: ' + e.message.slice(0, 300)));

await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const audit = await page.evaluate(() => {
  const marquee = document.querySelector('[class*="animate-marquee"]');
  const manifesto = /contemporánea|contemporanea/i.test(document.body.innerText);
  const heroImg = document.querySelector('section img');
  const framerMounted = !!document.querySelector('[style*="transform"], [data-framer-component]');
  const stylesWithTransform = document.querySelectorAll('[style*="transform"]').length;
  const opacityZero = document.querySelectorAll('[style*="opacity: 0"]').length;
  const allSections = document.querySelectorAll('section').length;
  return {
    marqueePresent: !!marquee,
    marqueeClass: marquee?.className?.slice(0, 100),
    manifesto,
    heroImgSrc: heroImg?.src?.slice(-40),
    framerMounted,
    stylesWithTransform,
    opacityZero,
    allSections,
    bodyLen: document.body.innerText.length,
  };
});

// Scroll down to trigger ScrollReveal/whileInView
await page.evaluate(() => window.scrollTo(0, 800));
await page.waitForTimeout(1500);
const afterScroll = await page.evaluate(() => ({
  opacityZero: document.querySelectorAll('[style*="opacity: 0"]').length,
  stylesWithTransform: document.querySelectorAll('[style*="transform"]').length,
}));

// Take screenshot
await page.screenshot({ path: '/tmp/motion-check.png', fullPage: false });

await browser.close();
console.log(JSON.stringify({ audit, afterScroll, errors: errors.slice(0, 5) }, null, 2));
