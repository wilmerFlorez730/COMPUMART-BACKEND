const express = require('express');
const pool = require('./db');
const router = express.Router();
const cart = {};
// Agregar un producto al carrito 
router.post('/carrito/agregar', async (req, res) => {
  const { pedidoId, productoId, cantidad } = req.body;

  // Validar datos de entrada
  if (!productoId || cantidad <= 0) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    let idPedido = pedidoId;

    // Crear un pedido si no se proporcionó uno
    if (!pedidoId) {
      const nuevoPedido = await pool.query(
        `INSERT INTO tienda.Pedido (Fecha, Estado, Total, Cliente_ID) 
         VALUES (NOW(), 'Pendiente', 0, 1) RETURNING ID_Pedido`
      );
      idPedido = nuevoPedido.rows[0].id_pedido;
    }

    // Obtener la información del producto desde la base de datos
    const producto = await pool.query(
      `SELECT Precio, Stock FROM tienda.Producto WHERE ID_Producto = $1`,
      [productoId]
    );

    if (producto.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const precioUnitario = producto.rows[0].precio;
    const stockDisponible = producto.rows[0].stock;

    // Verificar si la cantidad solicitada excede el stock disponible
    if (cantidad > stockDisponible) {
      return res.status(400).json({
        error: 'Cantidad solicitada excede el stock disponible',
        stockDisponible,
      });
    }

    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = await pool.query(
      `SELECT Cantidad, Subtotal FROM tienda.DetallePedido 
       WHERE Pedido_ID = $1 AND Producto_ID = $2`,
      [idPedido, productoId]
    );

    if (productoEnCarrito.rows.length > 0) {
      // Producto ya existe, actualizar cantidad y subtotal
      const nuevaCantidad =
        parseInt(productoEnCarrito.rows[0].cantidad) + parseInt(cantidad);

      // Verificar nuevamente el stock disponible con la nueva cantidad
      if (nuevaCantidad > stockDisponible) {
        return res.status(400).json({
          error: 'Cantidad total excede el stock disponible',
          stockDisponible,
        });
      }

      const nuevoSubtotal = nuevaCantidad * parseFloat(precioUnitario);

      await pool.query(
        `UPDATE tienda.DetallePedido 
         SET Cantidad = $1, Subtotal = $2 
         WHERE Pedido_ID = $3 AND Producto_ID = $4`,
        [nuevaCantidad, nuevoSubtotal, idPedido, productoId]
      );
    } else {
      // Producto no existe, agregarlo al carrito
      const subtotal = parseInt(cantidad) * parseFloat(precioUnitario);

      await pool.query(
        `INSERT INTO tienda.DetallePedido (Pedido_ID, Producto_ID, Cantidad, Subtotal, PrecioUnitario)
         VALUES ($1, $2, $3, $4, $5)`,
        [idPedido, productoId, cantidad, subtotal, precioUnitario]
      );
    }

    // Actualizar el stock del producto después de agregar al carrito
    const nuevoStock = stockDisponible - cantidad;
    await pool.query(
      `UPDATE tienda.Producto SET Stock = $1 WHERE ID_Producto = $2`,
      [nuevoStock, productoId]
    );

    res.status(200).json({
      mensaje: 'Producto agregado al carrito correctamente',
      pedidoId: idPedido,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al agregar producto al carrito', detalle: err.message });
  }
});

// Eliminar un producto del carrito
router.delete('/carrito/eliminar', async (req, res) => {
  const { pedidoId, productoId } = req.body;

  try {
    await pool.query(
      `DELETE FROM tienda.DetallePedido WHERE Pedido_ID = $1 AND Producto_ID = $2`,
      [pedidoId, productoId]
    );

    res.status(200).send({ mensaje: 'Producto eliminado del carrito correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al eliminar producto del carrito');
  }
});


// Obtener los productos en el carrito
router.get('/carrito/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;

  try {
    const productos = await pool.query(
      `SELECT dp.Producto_ID, p.Nombre, dp.Cantidad, dp.PrecioUnitario, dp.Subtotal
       FROM tienda.DetallePedido dp
       JOIN tienda.Producto p ON dp.Producto_ID = p.ID_Producto
       WHERE dp.Pedido_ID = $1`,
      [pedidoId]
    );

    res.status(200).json(productos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener los productos del carrito');
  }
});

// Calcular el total del carrito
router.get('/carrito/total/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;

  try {
    const total = await pool.query(
      `SELECT SUM(Subtotal) AS Total FROM tienda.DetallePedido WHERE Pedido_ID = $1`,
      [pedidoId]
    );

    res.status(200).json({ total: total.rows[0].total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al calcular el total del carrito');
  }
});

// Registrar un pedido desde el carrito
router.post('/carrito/checkout', async (req, res) => {
  const { userId, clienteId } = req.body;

  if (!cart[userId] || cart[userId].length === 0) {
    return res.status(400).send('El carrito está vacío');
  }

  try {
    // Insertar el pedido
    const pedidoResult = await pool.query(
      `INSERT INTO tienda.Pedido (Fecha, Estado, Total, Cliente_ID)
       VALUES (CURRENT_DATE, 'Pendiente', $1, $2) RETURNING ID_Pedido`,
      [cart[userId].reduce((sum, item) => sum + item.subtotal, 0), clienteId]
    );

    const pedidoId = pedidoResult.rows[0].id_pedido;

    // Insertar detalles del pedido
    for (const item of cart[userId]) {
      await pool.query(
        `INSERT INTO tienda.DetallePedido (Pedido_ID, Producto_ID, Cantidad, Subtotal, PrecioUnitario)
         VALUES ($1, $2, $3, $4, $5)`,
        [pedidoId, item.productoId, item.cantidad, item.subtotal, item.precioUnitario]
      );
    }

    // Limpiar el carrito
    delete cart[userId];

    res.status(201).json({ mensaje: 'Pedido registrado con éxito', pedidoId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al registrar pedido');
  }
});

  module.exports = router;