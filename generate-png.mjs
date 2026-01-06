import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePNG(htmlFile, pngFile) {
  const htmlPath = path.resolve(__dirname, htmlFile);
  const pngPath = path.resolve(__dirname, pngFile);

  console.log(`Generating ${pngFile}...`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1400, height: 2000, deviceScaleFactor: 2 });

  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0'
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  const dimensions = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    return {
      width: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth),
      height: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    };
  });

  await page.setViewport({ width: dimensions.width, height: dimensions.height, deviceScaleFactor: 2 });

  await page.screenshot({
    path: pngPath,
    fullPage: true,
    type: 'png'
  });

  await browser.close();
  console.log(`✓ ${pngFile} generated (${dimensions.width}x${dimensions.height}px @2x)`);
}

// Generate both versions
await generatePNG('sustainability-lab-join-us-poster.html', 'poster-dark.png');
await generatePNG('sustainability-lab-join-us-poster-light.html', 'poster-light.png');

console.log('\n✓ All PNGs generated successfully!');
