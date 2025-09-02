require('dotenv').config();
const app = require('./src/app');


const PORT = process.env.PORT || 3019;
app.listen(PORT, () => {
console.log(`✅ API corriendo en http://localhost:${PORT}`);
});