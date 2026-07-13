import { chromium } from 'playwright-chromium';
import fs from 'node:fs';

const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const OUT = '/tmp/pw-chefcta';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL + '/reservar', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: OUT + '/01-normal.png' });

// Find select and change to 12+
const sel = page.locator('#chef-guests');
await sel.selectOption('12+');
await page.waitForTimeout(500);
await page.screenshot({ path: OUT + '/02-12plus.png' });

// Verify note visible
const noteVisible = await page.evaluate(() => {
  const note = document.querySelector('[role="note"]');
  return note ? { text: note.innerText.slice(0, 100), opacity: getComputedStyle(note).opacity } : null;
});

// Change back to 2
await sel.selectOption('2');
await page.waitForTimeout(500);
await page.screenshot({ path: OUT + '/03-back-to-2.png' });
const noteGone = await page.evaluate(() => !document.querySelector('[role="note"]'));

await browser.close();
console.log(JSON.stringify({ noteAppeared: !!noteVisible, noteText: noteVisible?.text, noteOpacity: noteVisible?.opacity, noteGoneOnRevert: noteGone }, null, 2));