import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, 'sustainability-lab-join-us-poster.html');
const pdfPath = path.resolve(__dirname, 'sustainability-lab-join-us-poster.pdf');

console.log('Launching browser...');
const browser = await puppeteer.launch();
const page = await browser.newPage();

// Set viewport to ensure proper rendering
await page.setViewport({ width: 1400, height: 2000, deviceScaleFactor: 1 });

console.log('Loading HTML...');
await page.goto(`file://${htmlPath}`, {
  waitUntil: 'networkidle0'
});

// Wait a bit for any dynamic content
await new Promise(resolve => setTimeout(resolve, 1000));

// Get the actual content dimensions
const dimensions = await page.evaluate(() => {
  const body = document.body;
  const html = document.documentElement;

  const width = Math.max(
    body.scrollWidth,
    body.offsetWidth,
    html.clientWidth,
    html.scrollWidth,
    html.offsetWidth
  );
  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  return { width, height };
});

console.log('Content dimensions:', dimensions);

// Generate PDF with exact content size - ONE PAGE
await page.pdf({
  path: pdfPath,
  width: dimensions.width + 'px',
  height: dimensions.height + 'px',
  printBackground: true,
  margin: {
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px'
  },
  preferCSSPageSize: false
});

await browser.close();
console.log('\n✓ Single-page PDF generated successfully!');
console.log('  Size:', dimensions.width, 'x', dimensions.height, 'px');
console.log('  Location:', pdfPath);
