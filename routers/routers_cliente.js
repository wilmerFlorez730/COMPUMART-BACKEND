const express = require('express');
const pool = require('./db');
const router = express.Router();

// Registrar un cliente
router.post('/clientes', async (req, res) => {
  const { nombre, correo, contrasena, telefono } = req.body;

  try {
    if (!nombre || !correo || !contrasena || !telefono) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el correo ya está en uso
    const checkQuery = 'SELECT * FROM tienda.Cliente WHERE Correo = $1';
    const checkResult = await pool.query(checkQuery, [correo]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'El correo ya está en uso.' });
    }

    // Asignamos rol_id como 1 por defecto
    const rol_id = 1;

    // Insertar el cliente en la base de datos
    const query = 
      `INSERT INTO tienda.Cliente (Nombre, Correo, Contrasena, Telefono, Fecha_registro, Rol_ID)
      VALUES ($1, $2, $3, $4, CURRENT_DATE, $5) RETURNING *`;
    const values = [nombre, correo, contrasena, telefono, rol_id];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Cliente registrado exitosamente.', cliente: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Obtener todos los clientes
router.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tienda.Cliente');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Obtener un cliente específico por ID
router.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tienda.Cliente WHERE ID_Cliente = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Cliente no encontrado');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});
  module.exports = router;