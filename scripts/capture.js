const { chromium } = require('playwright');
const path = require('path');

/**
 * Script em Português para capturar screenshots atualizados do portal.
 * Use: pnpm capturar
 */

const screenshotsDir = path.join(
  __dirname,
  '..',
  'apps',
  'docs',
  'public',
  'docs-screenshots',
);
const publicHero = path.join(
  __dirname,
  '..',
  'apps',
  'docs',
  'public',
  'hero.png',
);

const pages = [
  { url: 'http://localhost:3000', filename: 'home.png' },
  { url: 'http://localhost:3000/episodios', filename: 'episodios.png' },
  { url: 'http://localhost:3000/sign-in', filename: 'sign-in.png' },
  { url: 'http://localhost:3000/docs', filename: 'docs.png' },
  { url: 'http://localhost:3000/admin/home', filename: 'app-home.png' },
  {
    url: 'http://localhost:3000/admin/episodios',
    filename: 'app-episodios.png',
  },
  {
    url: 'http://localhost:3000/admin/relatorios',
    filename: 'app-relatorios.png',
  },
];

(async () => {
  console.log('🚀 Iniciando atualização de screenshots...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  for (const { url, filename } of pages) {
    const page = await context.newPage();
    console.log(`📸 Capturando: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
      await page.waitForTimeout(2000);
      const dest = path.join(screenshotsDir, filename);
      await page.screenshot({ path: dest, fullPage: false });
      console.log(`   ✓ Salvo: ${filename}`);

      // Atualiza o hero se for a home
      if (filename === 'home.png') {
        const fs = require('fs');
        fs.copyFileSync(dest, publicHero);
        console.log('   ⭐ Hero image atualizada.');
      }
    } catch (err) {
      console.error(`   ✗ Erro em ${url}: ${err.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('\n✅ Todos os screenshots foram atualizados com sucesso!');
})();
