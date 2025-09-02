const { UsuarioReniec } = require('../models/usuarios_reniec'); // tu modelo ya existente
const { buscarDniEldni } = require('./scraper.service');        // ya implementado

/**
 * Busca primero en BD; si no existe, scrapea y guarda.
 * Retorna: { dni, nombres, apellidoPaterno, apellidoMaterno } | null
 */
exports.getPersonaPorDni = async (dni) => {
  // 1) BD (rápido)
  const found = await UsuarioReniec.findOne({
    where: { dni },
    attributes: ['dni', 'nombres', 'apellidoPaterno', 'apellidoMaterno'],
    raw: true
  });
  if (found) return found;

  // 2) Fallback: webscraping
  const { rows } = await buscarDniEldni(dni);
  if (!rows || !rows.length) return null;

  const { dni: _dni, nombres, apellidoPaterno, apellidoMaterno } = rows[0];
  const payload = { dni: _dni, nombres, apellidoPaterno, apellidoMaterno };

  // 3) Guardar sin bloquear la respuesta si ya existe
  try {
    await UsuarioReniec.create(payload);
  } catch (e) {
    // Si ya existe por condición de carrera: ignorar
    if (!(e && e.name === 'SequelizeUniqueConstraintError')) throw e;
  }

  return payload;
};