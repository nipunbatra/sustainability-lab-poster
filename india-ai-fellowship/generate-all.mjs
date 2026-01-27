import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const posters = [
    { html: 'indiaai-fellowship-poster.html', png: 'indiaai-fellowship-poster.png' },
    { html: 'indiaai-fellowship-v2-dark.html', png: 'indiaai-fellowship-v2-dark.png' },
    { html: 'indiaai-fellowship-v2-light.html', png: 'indiaai-fellowship-v2-light.png' },
    { html: 'indiaai-fellowship-v3-minimal.html', png: 'indiaai-fellowship-v3-minimal.png' },
    { html: 'indiaai-fellowship-v4-tricolor.html', png: 'indiaai-fellowship-v4-tricolor.png' },
];

async function generatePosters() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const poster of posters) {
        console.log(`Generating ${poster.png}...`);

        const page = await browser.newPage();

        await page.setViewport({
            width: 1200,
            height: 1200,
            deviceScaleFactor: 2
        });

        const htmlPath = path.join(__dirname, poster.html);
        await page.goto(`file://${htmlPath}`, {
            waitUntil: 'networkidle0'
        });

        await page.evaluateHandle('document.fonts.ready');
        await new Promise(r => setTimeout(r, 500));

        const posterElement = await page.$('.poster');

        await posterElement.screenshot({
            path: path.join(__dirname, poster.png),
            type: 'png'
        });

        await page.close();
        console.log(`  ✓ ${poster.png}`);
    }

    await browser.close();
    console.log('\nAll posters generated!');
}

generatePosters().catch(console.error);
