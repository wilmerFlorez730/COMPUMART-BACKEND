const express = require('express');
const pool = require('./db');
const router = express.Router();

// Obtener todos los productos disponibles
router.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT ID_Producto, Nombre, Precio FROM tienda.Producto WHERE Stock > 0');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Obtener un producto específico por ID
router.get('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tienda.Producto WHERE ID_Producto = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});


// Ruta para crear un nuevo producto

router.post('/productos', async (req, res) => {
  const { Nombre, Precio, Stock, Categoria_ID } = req.body;

  // Validación de datos
  if (!Nombre || !Precio || !Stock || !Categoria_ID) {
    return res.status(400).json({ error: 'Faltan datos necesarios' });
  }

  try {
    // Consulta para insertar un nuevo producto
    const result = await pool.query(
      'INSERT INTO tienda.Producto (Nombre, Precio, Stock, Categoria_ID) VALUES ($1, $2, $3, $4) RETURNING *',
      [Nombre, Precio, Stock, Categoria_ID]
    );

    // Enviar el producto recién creado
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta para agregar stock a un producto existente
router.put('/productos/stock/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID del producto
    const { cantidad } = req.body; // Cantidad a agregar al stock

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0.' });
    }

    // Actualizar el stock del producto
    const result = await pool.query(
      'UPDATE tienda.Producto SET Stock = Stock + $1 WHERE ID_Producto = $2 RETURNING *',
      [cantidad, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json({ message: 'Stock actualizado', producto: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});



  module.exports = router;