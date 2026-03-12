import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFile = 'sustainability-lab-join-us-poster-v2-light-improved.html';
const pdfFile = 'poster-v2-light-improved.pdf';
const pngFile = 'poster-v2-light-improved.png';

// Generate QR code SVG strings
const qrLabSvg = await QRCode.toString('https://sustainability-lab.github.io/', {
  type: 'svg', width: 100, margin: 1, color: { dark: '#1a2e1a', light: '#ffffff' }
});
const qrOpeningsSvg = await QRCode.toString('https://sustainability-lab.github.io/openings.html', {
  type: 'svg', width: 100, margin: 1, color: { dark: '#1a2e1a', light: '#ffffff' }
});

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  timeout: 60000
});
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });

const htmlPath = path.resolve(__dirname, htmlFile);
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

// Inject QR codes as inline SVGs
await page.evaluate((labSvg, openingsSvg) => {
  document.getElementById('qr-lab').innerHTML = labSvg;
  document.getElementById('qr-openings').innerHTML = openingsSvg;
}, qrLabSvg, qrOpeningsSvg);

await new Promise(resolve => setTimeout(resolve, 500));

const dimensions = await page.evaluate(() => {
  const body = document.body;
  const html = document.documentElement;
  return {
    width: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth),
    height: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  };
});

// Generate PDF with clickable links
const pdfPath = path.resolve(__dirname, pdfFile);
await page.pdf({
  path: pdfPath,
  width: dimensions.width + 'px',
  height: dimensions.height + 'px',
  printBackground: true,
  margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
  preferCSSPageSize: false
});
console.log(`✓ ${pdfFile} (${dimensions.width}x${dimensions.height}px)`);

// Generate PNG
const pngPath = path.resolve(__dirname, pngFile);
await page.setViewport({ width: dimensions.width, height: dimensions.height, deviceScaleFactor: 2 });
await page.screenshot({ path: pngPath, fullPage: true, type: 'png' });
console.log(`✓ ${pngFile} (${dimensions.width}x${dimensions.height}px @2x)`);

await page.close();
await browser.close();
console.log('\n✓ Done! PDF has clickable links + QR codes.');
