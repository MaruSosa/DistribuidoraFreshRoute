const express = require("express");

const router = express.Router();

const pedidosController = require("../controllers/pedidosController");

// ========================================
// CONSULTAS ESPECÍFICAS
// ========================================

// GET /pedidos/cliente?clienteId=1
router.get(
    "/cliente",
    pedidosController.obtenerPedidosPorCliente
);

// GET /pedidos/estado?estado=Pendiente
router.get(
    "/estado",
    pedidosController.obtenerPedidosPorEstado
);

// GET /pedidos/filtro?clienteId=1&estado=Entregado
router.get(
    "/filtro",
    pedidosController.obtenerPedidosPorFiltro
);

// ========================================
// CRUD DE PEDIDOS
// ========================================

// GET /pedidos
router.get(
    "/",
    pedidosController.obtenerPedidos
);

// POST /pedidos
router.post(
    "/",
    pedidosController.crearPedido
);

// GET /pedidos/:id
router.get(
    "/:id",
    pedidosController.obtenerPedidoPorId
);

// ========================================
// CAMBIAR ESTADO
// ========================================

// PATCH /pedidos/:id/estado
router.patch(
    "/:id/estado",
    pedidosController.cambiarEstadoPedido
);

// ========================================
// ASIGNAR REPARTIDOR
// ========================================

// PATCH /pedidos/:id/repartidor
router.patch(
    "/:id/repartidor",
    pedidosController.asignarRepartidor
);

module.exports = router;