const express = require('express');
const pool = require('./db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        if (!correo || !contrasena) {
            return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
        }

        // Consultar si el usuario existe
        const query = 'SELECT * FROM tienda.Cliente WHERE Correo = $1';
        const result = await pool.query(query, [correo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const cliente = result.rows[0];

        // Comparar la contraseña (considerar en el futuro usar bcrypt para cifrado)
        if (contrasena !== cliente.contrasena) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Verificar el rol del cliente
        if (cliente.rol_id === 2) {
            // Si es admin, no generar pedido, redirigir a Gestión de Productos
            return res.status(200).json({
                message: 'Inicio de sesión exitoso como administrador.',
                cliente: {
                    id: cliente.id_cliente,
                    nombre: cliente.nombre,
                    correo: cliente.correo,
                    rol_id: cliente.rol_id
                }
            });
        }

        // Generar un pedido para otros roles
        const fechaActual = new Date().toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
        const pedidoQuery = `
            INSERT INTO tienda.Pedido (Fecha, Estado, Total, Cliente_ID)
            VALUES ($1, $2, $3, $4) RETURNING *`;
        const pedidoResult = await pool.query(pedidoQuery, [
            fechaActual,
            'Pendiente',
            0, // Total inicial como 0
            cliente.id_cliente, // ID del cliente
        ]);

        const pedido = pedidoResult.rows[0];

        // Retornar la respuesta incluyendo información del login y del pedido
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            cliente: {
                id: cliente.id_cliente,
                nombre: cliente.nombre,
                correo: cliente.correo,
                rol_id: cliente.rol_id
            },
            pedido: {
                id: pedido.id_pedido,
                fecha: pedido.fecha,
                estado: pedido.estado,
                total: pedido.total,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
      if (!correo || !contrasena) {
          return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
      }

      // Consultar si el usuario existe
      const query = 'SELECT * FROM tienda.Cliente WHERE Correo = $1';
      const result = await pool.query(query, [correo]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      const cliente = result.rows[0];

      // Comparar la contraseña (considerar en el futuro usar bcrypt para cifrado)
      if (contrasena !== cliente.contrasena) {
          return res.status(401).json({ message: 'Contraseña incorrecta.' });
      }

      // Verificar el rol del cliente
      if (cliente.rol_id === 2) {
          // Si es admin, no generar pedido, redirigir a Gestión de Productos
          return res.status(200).json({
              message: 'Inicio de sesión exitoso como administrador.',
              cliente: {
                  id: cliente.id_cliente,
                  nombre: cliente.nombre,
                  correo: cliente.correo,
                  rol_id: cliente.rol_id
              }
          });
      }

      // Generar un pedido para otros roles
      const fechaActual = new Date().toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
      const pedidoQuery = `
          INSERT INTO tienda.Pedido (Fecha, Estado, Total, Cliente_ID)
          VALUES ($1, $2, $3, $4) RETURNING *`;
      const pedidoResult = await pool.query(pedidoQuery, [
          fechaActual,
          'Pendiente',
          0, // Total inicial como 0
          cliente.id_cliente, // ID del cliente
      ]);

      const pedido = pedidoResult.rows[0];

      // Retornar la respuesta incluyendo información del login y del pedido
      res.status(200).json({
          message: 'Inicio de sesión exitoso.',
          cliente: {
              id: cliente.id_cliente,
              nombre: cliente.nombre,
              correo: cliente.correo,
              rol_id: cliente.rol_id
          },
          pedido: {
              id: pedido.id_pedido,
              fecha: pedido.fecha,
              estado: pedido.estado,
              total: pedido.total,
          },
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor.' });
  }
});








module.exports = router;