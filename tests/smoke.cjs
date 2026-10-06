// Browser checks use an installed Chromium; no browser download is required.
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const server = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1', '--directory', path.resolve(__dirname, '..')], { stdio: ['ignore', 'ignore', 'pipe'] });
let serverError = '';
server.stderr.on('data', chunk => serverError += chunk);
server.on('error', error => serverError += error.message);
(async () => {
  let browser;
  try {
    for (let attempt = 0; ; attempt++) {
      if (server.exitCode !== null) throw new Error(`Test server failed: ${serverError}`);
      try { const response = await fetch('http://127.0.0.1:8765/'); if (response.ok) break; } catch {}
      if (attempt >= 30) throw new Error(`Test server not ready: ${serverError}`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [], failedResponses = [], externalRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) failedResponses.push(response.url()); });
    await page.route('**/*', route => {
      if (new URL(route.request().url()).hostname !== '127.0.0.1') {
        externalRequests.push(route.request().url()); return route.abort();
      }
      return route.continue();
    });
    await page.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle' });
    assert.deepEqual(await page.locator('main > section').evaluateAll(elements => elements.map(element => element.id)), ['top', 'intro', 'change', 'works', 'story']);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.p-top-works-card').count(), 4);
    assert.equal(await page.locator('.p-top-change__item').count(), 4);
    assert.equal(await page.locator('.p-top-story__photo').count(), 3);
    assert.equal(await page.locator('a[href^="#"]').evaluateAll(links => links.every(link => document.getElementById(link.getAttribute('href').slice(1)))), true);
    await page.locator('[data-consultation]').first().click();
    assert.equal(await page.locator('dialog').evaluate(element => element.open), true);
    assert.equal(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').evaluate(element => element.open), false);
    assert.equal(await page.locator('[data-consultation]').first().evaluate(element => element === document.activeElement), true);
    await page.locator('[data-consultation]').last().click();
    await page.locator('dialog .c-button').click();
    assert.equal(await page.locator('dialog').evaluate(element => element.open), false);
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Horizontal overflow at ${width}px`);
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.locator('.p-top-story__heading').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    assert.equal(await page.locator('.p-top-story__heading').evaluate(element => getComputedStyle(element).opacity), '1');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.is-pending').count(), 0);
    assert.equal(await page.locator('.p-top-fv__orb').evaluate(element => getComputedStyle(element).animationName), 'none');
    assert.equal(await page.locator('[data-particles]').evaluate(element => element.style.getPropertyValue('--progress')), '0.000');
    const noJS = await browser.newContext({ javaScriptEnabled: false });
    const noJSPage = await noJS.newPage();
    await noJSPage.goto('http://127.0.0.1:8765/');
    assert.equal(await noJSPage.locator('.p-top-story__heading').evaluate(element => getComputedStyle(element).opacity), '1');
    await noJS.close();
    await page.goto('http://127.0.0.1:8765/preview.html', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    await page.locator('[data-consultation]').first().click();
    assert.equal(await page.locator('dialog').evaluate(element => element.open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').evaluate(element => element.open), false);
    assert.deepEqual(errors, []);
    assert.deepEqual(failedResponses, []);
    assert.deepEqual(externalRequests, []);
    console.log('PASS: sections, works, local assets, anchor links, dialog/focus/Escape, 5 viewport widths, scroll fade, reduced motion, no-JS readability, generated preview.');
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
