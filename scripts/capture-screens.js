/**
 * capture-screens.js
 * Captura screenshots de todas as páginas para o docs-screenshots.
 *
 * Uso:  node scripts/capture-screens.js
 * Req.: servidor rodando em localhost:3000 (pnpm dev:clean)
 */

const path = require('path');

const { chromium } = require('playwright');

const screenshotsDir = path.join(
  __dirname, '..', 'apps', 'docs', 'public', 'docs-screenshots'
);

const pages = [
  { url: 'http://localhost:3000',                  filename: 'home.png' },
  { url: 'http://localhost:3000/episodios',         filename: 'episodios.png' },
  { url: 'http://localhost:3000/sign-in',           filename: 'sign-in.png' },
  { url: 'http://localhost:3000/docs',              filename: 'docs.png' },
  { url: 'http://localhost:3000/admin/home',        filename: 'app-home.png' },
  { url: 'http://localhost:3000/admin/episodios',   filename: 'app-episodios.png' },
  { url: 'http://localhost:3000/admin/relatorios',  filename: 'app-relatorios.png' },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  for (const { url, filename } of pages) {
    const page = await context.newPage();
    console.log(`📸 Capturing: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
      await page.waitForTimeout(2500);
      const dest = path.join(screenshotsDir, filename);
      await page.screenshot({ path: dest, fullPage: false });
      console.log(`   ✓ Saved: ${filename}`);
    } catch (err) {
      console.error(`   ✗ Error on ${url}: ${err.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('\n✅ Done! All screenshots captured.');
})();
