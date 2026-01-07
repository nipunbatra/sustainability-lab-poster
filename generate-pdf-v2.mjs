import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, 'sustainability-lab-join-us-poster-v2.html');
const pdfPath = path.resolve(__dirname, 'sustainability-lab-join-us-poster-v2.pdf');

console.log('Launching browser...');
const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });

console.log('Loading HTML...');
await page.goto(`file://${htmlPath}`, {
  waitUntil: 'networkidle0'
});

await new Promise(resolve => setTimeout(resolve, 1000));

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
console.log('\n✓ V2 PDF generated successfully!');
console.log('  Size:', dimensions.width, 'x', dimensions.height, 'px');
console.log('  Location:', pdfPath);
