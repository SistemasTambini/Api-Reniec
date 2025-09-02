const puppeteer = require('puppeteer');
const os = require('os');
const path = require('path');

const defaultArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--window-size=1200,800'
];

let _browser;
async function getBrowser() {
  if (_browser?.isConnected()) return _browser;
  _browser = await puppeteer.launch({
    headless: true,
    args: defaultArgs,
    userDataDir: path.join(os.tmpdir(), 'pptr_reniec_cache') // cache entre requests
  });
  return _browser;
}

async function newFastPage() {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118 Safari/537.36'
  );
  await page.setViewport({ width: 1200, height: 800 });

  // Bloquear recursos pesados/ads
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const rt = req.resourceType();
    const url = req.url();
    if (
      rt === 'image' || rt === 'media' || rt === 'font' || rt === 'stylesheet' ||
      /doubleclick|googletag|ads|gpt|analytics/i.test(url)
    ) return req.abort();
    req.continue();
  });

  return page;
}

const fastNav = { waitUntil: 'domcontentloaded', timeout: 15000 };

module.exports = { getBrowser, newFastPage, fastNav };
