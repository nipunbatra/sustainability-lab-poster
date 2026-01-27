import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePoster() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport to match poster size
    await page.setViewport({
        width: 1200,
        height: 1200,
        deviceScaleFactor: 2 // High DPI for crisp output
    });

    // Load the HTML file
    const htmlPath = path.join(__dirname, 'indiaai-fellowship-poster.html');
    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0'
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Small delay for animations to settle
    await new Promise(r => setTimeout(r, 1000));

    // Take screenshot of just the poster element
    const posterElement = await page.$('.poster');

    await posterElement.screenshot({
        path: path.join(__dirname, 'indiaai-fellowship-poster.png'),
        type: 'png'
    });

    console.log('PNG generated: indiaai-fellowship-poster.png');

    await browser.close();
}

generatePoster().catch(console.error);
