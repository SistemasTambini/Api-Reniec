const { launchBrowser, defaultNavOptions, hardenPage,newFastPage, fastNav } = require('../config/puppeter');


async function withBrowser(run) {
const browser = await launchBrowser();
try {
return await run(browser);
} finally {
await browser.close().catch(() => {});
}
}


async function scrapeTextBySelector(url, selector) {
return withBrowser(async (browser) => {
const page = await browser.newPage();
await hardenPage(page);
await page.goto(url, defaultNavOptions);
await page.waitForSelector(selector, { timeout: 15000 });
const texts = await page.$$eval(selector, (els) =>
els.map((el) => (el.innerText || el.textContent || '').trim()).filter(Boolean)
);
return texts;
});
}


async function scrapeHtmlBySelector(url, selector) {
return withBrowser(async (browser) => {
const page = await browser.newPage();
await hardenPage(page);
await page.goto(url, defaultNavOptions);
if (selector) {
await page.waitForSelector(selector, { timeout: 15000 });
return await page.$eval(selector, (el) => el.outerHTML);
}
return await page.content();
});
}


async function screenshot(url, { fullPage = false } = {}) {
return withBrowser(async (browser) => {
const page = await browser.newPage();
await hardenPage(page);
await page.goto(url, defaultNavOptions);
const buffer = await page.screenshot({ type: 'png', fullPage });
return buffer.toString('base64');
});
}

async function buscarDniEldni(dni) {
  if (!/^\d{8}$/.test(String(dni))) throw new Error('DNI inválido');

  const page = await newFastPage();
  try {
    await page.goto('https://eldni.com/', fastNav);
    await page.type('#dni', String(dni), { delay: 20 });

    await Promise.all([
      page.waitForNavigation(fastNav),
      page.click('#btn-buscar-datos-por-dni')
    ]);

    const rowSelector = 'table.table.table-striped.table-scroll tbody tr';

    const hasRows = await page.$(rowSelector);
    if (!hasRows) return { count: 0, rows: [] }; // evita 500

    const rows = await page.$$eval(rowSelector, (trs) =>
      trs.map((tr) => {
        const tds = Array.from(tr.querySelectorAll('td')).map(td => (td.innerText || td.textContent || '').trim());
        return { dni: tds[0] || '', nombres: tds[1] || '', apellidoPaterno: tds[2] || '', apellidoMaterno: tds[3] || '' };
      })
    );
    return { count: rows.length, rows };
  } finally {
    await page.close().catch(() => {});
  }
}


module.exports = {
scrapeTextBySelector,
scrapeHtmlBySelector,
screenshot,
buscarDniEldni // ← nuevo export
};


