const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


const scraperRoutes = require('./routes/scraper.routes');


const app = express();


app.use(express.json({ limit: '1mb' }));
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));


app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/scrape', scraperRoutes);


// 404
app.use((req, res) => {
res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
});


// Handler de errores
app.use((err, req, res, next) => {
console.error('❌ Error:', err);
res.status(500).json({ ok: false, error: err.message || 'Error interno' });
});


module.exports = app;