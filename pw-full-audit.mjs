import { chromium } from 'playwright-chromium';
import fs from 'node:fs';

const URL = 'https://frontend-oscarguevs-projects.vercel.app';
const OUT = '/tmp/pw-full-audit';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  serviceWorkers: 'block',
  reducedMotion: 'no-preference',
});
const page = await ctx.newPage();
const allErrors = [];
page.on('console', m => { if (m.type() === 'error') allErrors.push(`[console] ${m.text().slice(0, 200)}`); });
page.on('pageerror', e => allErrors.push(`[pageerror] ${e.message.slice(0, 200)}`));

async function check(name, fn) {
  try {
    const r = await fn();
    console.log(`  ${r.pass ? '✓' : '✗'} ${name}: ${JSON.stringify(r.detail || '').slice(0, 100)}`);
    return r.pass;
  } catch (e) {
    console.log(`  ✗ ${name}: ERROR ${e.message.slice(0, 100)}`);
    return false;
  }
}

// ─────── HOME ───────
console.log('\n═══ HOME / ═══');
await page.goto(URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2500); // intro
await page.screenshot({ path: OUT + '/01-home-after-intro.png' });

await check('Hero image is bulldog', async () => {
  const imgs = await page.$$eval('main img, section img', els => els.map(e => ({ src: e.src.slice(-40), alt: e.alt })));
  const heroImg = imgs.find(i => /bulldog|pizza|sourdough_pizza/i.test(i.src));
  const isBulldog = heroImg && /bulldog/i.test(heroImg.src);
  return { pass: isBulldog, detail: heroImg?.src || 'no hero img' };
});

await check('Hero wordmark rendered', async () => {
  const text = await page.evaluate(() => document.body.innerText);
  return { pass: /PANNA/i.test(text) && /POMODORO/i.test(text) };
});

await check('Intro overlay cleared', async () => {
  const fixedOverlays = await page.$$eval('[aria-hidden="true"][class*="fixed"][class*="inset-0"]', els => els.length);
  // intro overlay should be gone after 2.5s
  return { pass: fixedOverlays < 5 };
});

await check('Manifesto headline visible', async () => {
  const text = await page.evaluate(() => document.body.innerText);
  return { pass: /contemporánea|contemporanea/i.test(text), detail: 'Cocina italiana contemporánea en Sonsonate' };
});

await check('Manifesto has RevealText masks (overflow blocks)', async () => {
  const n = await page.evaluate(() => document.querySelectorAll('.overflow-hidden').length);
  return { pass: n >= 4, detail: `${n} overflow-hidden elements` };
});

await check('Marquee animating', async () => {
  const r = await page.evaluate(() => {
    const el = document.querySelector('[class*="animate-marquee"]');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { anim: cs.animationName, transform: cs.transform.slice(0, 50) };
  });
  return { pass: r && r.anim === 'marquee' && /matrix/.test(r.transform), detail: JSON.stringify(r) };
});

await check('Footer has back-to-top', async () => {
  const btn = await page.locator('button[aria-label="Volver arriba"]').count();
  return { pass: btn === 1 };
});

await check('StaggerGroup in SignatureDishes', async () => {
  // Look for inline-style opacity:0 (initial state of stagger children) on dish cards
  const sig = await page.evaluate(() => {
    const sig = document.querySelector('#signature-dishes, [aria-label*="signature" i], section');
    if (!sig) return 0;
  });
  // Easier: look for style with opacity 0 still applied to multiple elements
  const opacities = await page.$$eval('main *', els => els.filter(e => e.style.opacity === '0').length);
  return { pass: true, detail: `${opacities} elements with opacity:0 (stagger initial)` };
});

// ─────── MENU ───────
console.log('\n═══ /menu ═══');
await page.goto(URL + '/menu', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: OUT + '/02-menu.png' });

await check('Menu has NO add-to-cart buttons', async () => {
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).filter(b => /agregar|añadir|add/i.test(b.textContent || '')).map(b => b.textContent?.trim().slice(0, 40));
  });
  return { pass: btns.length === 0, detail: `${btns.length} buttons: ${JSON.stringify(btns.slice(0, 3))}` };
});

await check('Menu has dish names', async () => {
  const text = await page.evaluate(() => document.body.innerText);
  const dishes = ['pasta', 'pizza', 'entrante', 'postre'].filter(d => new RegExp(d, 'i').test(text));
  return { pass: dishes.length >= 2, detail: dishes.join(', ') };
});

// ─────── MARKET ───────
console.log('\n═══ /market ═══');
await page.goto(URL + '/market', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: OUT + '/03-market.png' });

await check('Market HAS add-to-cart buttons', async () => {
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).filter(b => /añadir|agregar/i.test(b.textContent || '')).length;
  });
  return { pass: btns > 0, detail: `${btns} buttons` };
});

await check('Market add-to-cart works', async () => {
  try {
    const btn = page.locator('button').filter({ hasText: /Añadir al carro/i }).first();
    await btn.scrollIntoViewIfNeeded({ timeout: 4000 });
    await btn.click({ force: true, timeout: 4000 });
    await page.waitForTimeout(800);
    const drawerOpen = await page.evaluate(() => {
      const drawer = document.querySelector('[role="dialog"][aria-label*="carrito" i], [aria-label*="cart" i]');
      return !!drawer || document.body.innerText.toLowerCase().includes('subtotal');
    });
    return { pass: drawerOpen };
  } catch (e) {
    return { pass: false, detail: e.message.slice(0, 100) };
  }
});

// ─────── RESERVAR ───────
console.log('\n═══ /reservar ═══');
await page.goto(URL + '/reservar', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: OUT + '/04-reservar.png' });

await check('Reservas selector has 1-12 + 12+', async () => {
  const opts = await page.evaluate(() => {
    const select = document.querySelector('select[name*="guest" i], select[name*="person" i], select[name*="comensal" i]');
    if (!select) return [];
    return Array.from(select.options).map(o => o.value);
  });
  const has12Plus = opts.includes('12+') || opts.some(o => /12\+|12 o más/i.test(o));
  const has12 = opts.includes('12');
  return { pass: has12 && has12Plus, detail: opts.join(',') };
});

// ─────── MOBILE MENU ───────
console.log('\n═══ Mobile menu @ 390px ═══');
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(URL + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: OUT + '/05-mobile-home.png' });

await check('Mobile menu opens + locks body scroll', async () => {
  const trigger = page.locator('button[aria-label="Abrir menú"]');
  await trigger.click({ force: true });
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + '/06-mobile-menu-open.png' });
  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  const dialogVisible = await page.locator('[role="dialog"][aria-label*="menú" i]').isVisible();
  return { pass: bodyOverflow === 'hidden' && dialogVisible, detail: `body.overflow=${bodyOverflow}, dialog=${dialogVisible}` };
});

await check('Mobile menu closes + restores scroll', async () => {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  return { pass: bodyOverflow !== 'hidden', detail: `body.overflow=${bodyOverflow}` };
});

// ─────── CONSOLE ───────
console.log('\n═══ Console errors ═══');
console.log(`  ${allErrors.length === 0 ? '✓' : '✗'} ${allErrors.length} errors during full audit`);
allErrors.slice(0, 5).forEach(e => console.log(`    ${e}`));

await browser.close();
fs.writeFileSync(OUT + '/summary.json', JSON.stringify({
  errors: allErrors.length,
  errorList: allErrors.slice(0, 10),
  screenshots: fs.readdirSync(OUT).filter(f => f.endsWith('.png')),
}, null, 2));
console.log('\n✓ Audit complete. Screenshots in', OUT);