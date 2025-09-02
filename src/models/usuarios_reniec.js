// src/models/usuarios_reniec.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UsuarioReniec = sequelize.define('UsuarioReniec', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  dni: { type: DataTypes.STRING(45), allowNull: false, unique: true },
  nombres: { type: DataTypes.STRING(255), allowNull: false },
  apellidoPaterno: { type: DataTypes.STRING(255), allowNull: false },
  apellidoMaterno: { type: DataTypes.STRING(255), allowNull: false }
}, {
  tableName: 'usuarios_reniec',  // evita pluralización
  freezeTableName: true,
  timestamps: false              // 👈 clave para tu error
});

module.exports = { UsuarioReniec };
