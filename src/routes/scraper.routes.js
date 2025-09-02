const router = require('express').Router();
const ctrl = require('../controllers/scraper.controller');


router.post('/text', ctrl.getText); // { url, selector }
router.post('/html', ctrl.getHtml); // { url, selector? }
router.post('/screenshot', ctrl.getScreenshot); // { url, fullPage? }
router.post('/dni', ctrl.consultarDniEldni); // 👈 simple

module.exports = router;