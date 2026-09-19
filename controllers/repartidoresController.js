const fs = require("fs");
const path = require("path");
const Repartidor = require("../models/Repartidor");

const repartidoresPath = path.join(
    __dirname,
    "..",
    "data",
    "repartidores.json"
);

// Leer repartidores
function leerRepartidores() {
    const datos = fs.readFileSync(repartidoresPath, "utf-8");
    return JSON.parse(datos);
}

// Guardar repartidores
function guardarRepartidores(repartidores) {
    fs.writeFileSync(
        repartidoresPath,
        JSON.stringify(repartidores, null, 2)
    );
}

// GET /repartidores
function obtenerRepartidores(req, res) {
    try {
        const repartidores = leerRepartidores();

        res.status(200).json(repartidores);

    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los repartidores"
        });
    }
}

// POST /repartidores
function crearRepartidor(req, res) {
    try {
        const {
            nombre,
            telefono,
            disponible
        } = req.body;

        // Validar campos obligatorios
        if (
            nombre === undefined ||
            telefono === undefined ||
            disponible === undefined
        ) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios"
            });
        }

        // Validar tipos
        if (
            typeof nombre !== "string" ||
            typeof telefono !== "string" ||
            typeof disponible !== "boolean"
        ) {
            return res.status(400).json({
                error: "Los datos ingresados no tienen un formato válido"
            });
        }

        const repartidores = leerRepartidores();

        // Generar nuevo ID
        const nuevoId =
            repartidores.length > 0
                ? Math.max(
                    ...repartidores.map(repartidor => repartidor.id)
                ) + 1
                : 1;

        // Crear utilizando POO
        const nuevoRepartidor = new Repartidor(
            nuevoId,
            nombre,
            telefono,
            disponible
        );

        repartidores.push(nuevoRepartidor);

        guardarRepartidores(repartidores);

        res.status(201).json({
            mensaje: "Repartidor creado correctamente",
            repartidor: nuevoRepartidor
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al crear el repartidor"
        });
    }
}

// GET /repartidores/:id
function obtenerRepartidorPorId(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El ID debe ser un número"
            });
        }

        const repartidores = leerRepartidores();

        const repartidor = repartidores.find(
            repartidor => repartidor.id === id
        );

        if (!repartidor) {
            return res.status(404).json({
                error: "Repartidor no encontrado"
            });
        }

        res.status(200).json(repartidor);

    } catch (error) {
        res.status(500).json({
            error: "Error al buscar el repartidor"
        });
    }
}

// PUT /repartidores/:id
function actualizarRepartidor(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El ID debe ser un número"
            });
        }

        const {
            nombre,
            telefono,
            disponible
        } = req.body;

        // Validar campos
        if (
            nombre === undefined ||
            telefono === undefined ||
            disponible === undefined
        ) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios"
            });
        }

        // Validar tipos
        if (
            typeof nombre !== "string" ||
            typeof telefono !== "string" ||
            typeof disponible !== "boolean"
        ) {
            return res.status(400).json({
                error: "Los datos ingresados no tienen un formato válido"
            });
        }

        const repartidores = leerRepartidores();

        const indice = repartidores.findIndex(
            repartidor => repartidor.id === id
        );

        if (indice === -1) {
            return res.status(404).json({
                error: "Repartidor no encontrado"
            });
        }

        repartidores[indice].nombre = nombre;
        repartidores[indice].telefono = telefono;
        repartidores[indice].disponible = disponible;

        guardarRepartidores(repartidores);

        res.status(200).json({
            mensaje: "Repartidor actualizado correctamente",
            repartidor: repartidores[indice]
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar el repartidor"
        });
    }
}

// DELETE /repartidores/:id
function eliminarRepartidor(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El ID debe ser un número"
            });
        }

        const repartidores = leerRepartidores();

        const indice = repartidores.findIndex(
            repartidor => repartidor.id === id
        );

        if (indice === -1) {
            return res.status(404).json({
                error: "Repartidor no encontrado"
            });
        }

        repartidores.splice(indice, 1);

        guardarRepartidores(repartidores);

        res.status(200).json({
            mensaje: "Repartidor eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar el repartidor"
        });
    }
}

module.exports = {
    obtenerRepartidores,
    crearRepartidor,
    obtenerRepartidorPorId,
    actualizarRepartidor,
    eliminarRepartidor
};