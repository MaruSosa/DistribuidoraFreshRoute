const express = require("express");

const router = express.Router();

const repartidoresController = require("../controllers/repartidoresController");

// GET /repartidores
router.get("/", repartidoresController.obtenerRepartidores);

// POST /repartidores
router.post("/", repartidoresController.crearRepartidor);

// GET /repartidores/:id
router.get("/:id", repartidoresController.obtenerRepartidorPorId);

// PUT /repartidores/:id
router.put("/:id", repartidoresController.actualizarRepartidor);

// DELETE /repartidores/:id
router.delete("/:id", repartidoresController.eliminarRepartidor);

module.exports = router;