const puppeteer = require('puppeteer');
(async () => {
const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
await page.goto("https://www.e-uchina.net");
await browser.close();
})();
