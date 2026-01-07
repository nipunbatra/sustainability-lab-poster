import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const variants = [
  { html: 'sustainability-lab-join-us-poster-v2.html', pdf: 'poster-v2-dark.pdf', png: 'poster-v2-dark.png' },
  { html: 'sustainability-lab-join-us-poster-v2-light.html', pdf: 'poster-v2-light.pdf', png: 'poster-v2-light.png' },
  { html: 'sustainability-lab-join-us-poster-v2-blue.html', pdf: 'poster-v2-blue.pdf', png: 'poster-v2-blue.png' },
  { html: 'sustainability-lab-join-us-poster-v2-blue-light.html', pdf: 'poster-v2-blue-light.pdf', png: 'poster-v2-blue-light.png' },
  { html: 'sustainability-lab-join-us-poster-v2-earth.html', pdf: 'poster-v2-earth.pdf', png: 'poster-v2-earth.png' },
  { html: 'sustainability-lab-join-us-poster-v2-earth-light.html', pdf: 'poster-v2-earth-light.pdf', png: 'poster-v2-earth-light.png' },
  { html: 'sustainability-lab-join-us-poster-v2-purple.html', pdf: 'poster-v2-purple.pdf', png: 'poster-v2-purple.png' },
  { html: 'sustainability-lab-join-us-poster-v2-purple-light.html', pdf: 'poster-v2-purple-light.pdf', png: 'poster-v2-purple-light.png' },
];

const browser = await puppeteer.launch();

for (const variant of variants) {
  const htmlPath = path.resolve(__dirname, variant.html);
  const pdfPath = path.resolve(__dirname, variant.pdf);

  console.log(`Generating ${variant.pdf}...`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 500));

  const dimensions = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    return {
      width: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth),
      height: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    };
  });

  await page.pdf({
    path: pdfPath,
    width: dimensions.width + 'px',
    height: dimensions.height + 'px',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    preferCSSPageSize: false
  });

  // Generate PNG
  const pngPath = path.resolve(__dirname, variant.png);
  await page.setViewport({ width: dimensions.width, height: dimensions.height, deviceScaleFactor: 2 });
  await page.screenshot({ path: pngPath, fullPage: true, type: 'png' });

  console.log(`  ✓ ${variant.pdf} + ${variant.png} (${dimensions.width}x${dimensions.height}px)`);
  await page.close();
}

await browser.close();
console.log('\n✓ All v2 PDFs generated!');
