const { scrapeTextBySelector, scrapeHtmlBySelector, screenshot, buscarDniEldni } = require('../services/scraper.service');
const { getPersonaPorDni } = require('../services/reniec.service');

function isValidUrl(url) {
try {
new URL(url);
return true;
} catch {
return false;
}
}

exports.getText = async (req, res, next) => {
try {
const { url, selector } = req.body;
if (!url || !selector) return res.status(400).json({ ok: false, error: 'url y selector son requeridos' });
if (!isValidUrl(url)) return res.status(400).json({ ok: false, error: 'URL inválida' });


const data = await scrapeTextBySelector(url, selector);
res.json({ ok: true, count: data.length, data });
} catch (err) {
next(err);
}
};

exports.getHtml = async (req, res, next) => {
try {
const { url, selector } = req.body;
if (!url) return res.status(400).json({ ok: false, error: 'url es requerido' });
if (!isValidUrl(url)) return res.status(400).json({ ok: false, error: 'URL inválida' });


const html = await scrapeHtmlBySelector(url, selector);
res.json({ ok: true, html });
} catch (err) {
next(err);
}
};

exports.getScreenshot = async (req, res, next) => {
try {
const { url, fullPage } = req.body;
if (!url) return res.status(400).json({ ok: false, error: 'url es requerido' });
if (!isValidUrl(url)) return res.status(400).json({ ok: false, error: 'URL inválida' });


const base64 = await screenshot(url, { fullPage: !!fullPage });
res.json({ ok: true, mime: 'image/png', base64 });
} catch (err) {
next(err);
}
};

exports.consultarDniEldni = async (req, res, next) => {
  try {
    const { dni } = req.body;
    if (!/^\d{8}$/.test(String(dni || '')))
      return res.status(400).json({ error: 'dni (8 dígitos) requerido' });

    const persona = await getPersonaPorDni(String(dni));
    if (!persona) return res.status(404).json({ error: 'No encontrado' });

    return res.json(persona); // 👈 solo lo que vas a usar
  } catch (err) {
    next(err);
  }
};
