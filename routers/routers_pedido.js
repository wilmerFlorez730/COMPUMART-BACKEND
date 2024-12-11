const express = require('express');
const pool = require('./db');
const router = express.Router();
// Registrar un pedido
router.post('/pedidos', async (req, res) => {
    const { fecha, estado, total, cliente_id } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO tienda.Pedido (Fecha, Estado, Total, Cliente_ID)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [fecha, estado, total, cliente_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error al registrar pedido');
    }
  });
  
  // Obtener todos los pedidos
  router.get('/pedidos', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM tienda.Pedido');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error del servidor');
    }
  });
  
  // Obtener un pedido específico por ID
  router.get('/pedidos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM tienda.Pedido WHERE ID_Pedido = $1', [id]);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Pedido no encontrado');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error del servidor');
    }
  });

  router.post('/pedidos/finalizar', async (req, res) => {
    const { pedidoId, metodoPago, totalPagado } = req.body;
  
    try {
        // Validar que el pedido exista y tenga productos
        const productosEnPedido = await pool.query(
            `SELECT * FROM tienda.DetallePedido WHERE Pedido_ID = $1`,
            [pedidoId]
        );
  
        if (productosEnPedido.rows.length === 0) {
            return res.status(400).json({ error: 'El pedido no tiene productos' });
        }
  
        // Actualizar el estado del pedido a 'Finalizado'
        const pedidoActualizado = await pool.query(
            `UPDATE tienda.Pedido SET Estado = 'Finalizado', Total = $1 WHERE ID_Pedido = $2 RETURNING *`,
            [totalPagado, pedidoId]
        );
  
        if (pedidoActualizado.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
  
        // Registrar el pago por cada detalle del pedido
        if (metodoPago && totalPagado) {
            const totalProductos = productosEnPedido.rows.length;
            const montoPorProducto = totalPagado / totalProductos;
  
            for (const detalle of productosEnPedido.rows) {
                await pool.query(
                    `INSERT INTO tienda.Pago (DetallePedido_ID, Metodo_Pago, Monto, Estado, Fecha_Pago)
                     VALUES ($1, $2, $3, 'Completado', NOW())`,
                    [detalle.id_detalle, metodoPago, montoPorProducto]
                );
            }
        }
  
        // (Opcional) Actualizar el inventario de productos
        for (const producto of productosEnPedido.rows) {
            await pool.query(
                `UPDATE tienda.Producto 
                 SET Stock = Stock - $1
                 WHERE ID_Producto = $2`,
                [producto.cantidad, producto.producto_id]
            );
        }
  
        res.status(200).json({
            mensaje: 'Pedido finalizado correctamente',
            pedido: pedidoActualizado.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: 'Error al finalizar el pedido',
            detalle: err.message,
        });
    }
  });
  
  module.exports = router;