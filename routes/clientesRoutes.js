const express = require("express");

const router = express.Router();

const clientesController = require("../controllers/clientesController");

router.get("/", clientesController.obtenerClientes);

router.post("/", clientesController.crearCliente);

router.get("/:id", clientesController.obtenerClientePorId);

router.put("/:id", clientesController.actualizarCliente);

router.delete("/:id", clientesController.eliminarCliente);

module.exports = router;
