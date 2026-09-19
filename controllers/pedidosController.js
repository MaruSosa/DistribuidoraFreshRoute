const fs = require("fs");
const path = require("path");
const Pedido = require("../models/Pedido");

const pedidosPath = path.join(
    __dirname,
    "..",
    "data",
    "pedidos.json"
);

const clientesPath = path.join(
    __dirname,
    "..",
    "data",
    "clientes.json"
);

const productosPath = path.join(
    __dirname,
    "..",
    "data",
    "productos.json"
);

const repartidoresPath = path.join(
    __dirname,
    "..",
    "data",
    "repartidores.json"
);

// ==============================
// FUNCIONES PARA LEER JSON
// ==============================

function leerPedidos() {
    const datos = fs.readFileSync(pedidosPath, "utf-8");
    return JSON.parse(datos);
}

function leerClientes() {
    const datos = fs.readFileSync(clientesPath, "utf-8");
    return JSON.parse(datos);
}

function leerProductos() {
    const datos = fs.readFileSync(productosPath, "utf-8");
    return JSON.parse(datos);
}

function leerRepartidores() {
    const datos = fs.readFileSync(repartidoresPath, "utf-8");
    return JSON.parse(datos);
}

// ==============================
// GUARDAR PEDIDOS
// ==============================

function guardarPedidos(pedidos) {
    fs.writeFileSync(
        pedidosPath,
        JSON.stringify(pedidos, null, 2)
    );
}

// ==============================
// GET /pedidos
// ==============================

function obtenerPedidos(req, res) {
    try {
        const pedidos = leerPedidos();

        res.status(200).json(pedidos);

    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los pedidos"
        });
    }
}

// ==============================
// POST /pedidos
// ==============================

function crearPedido(req, res) {
    try {
        const {
            clienteId,
            productos,
            repartidorId
        } = req.body;

        // Validar clienteId
        if (clienteId === undefined) {
            return res.status(400).json({
                error: "El clienteId es obligatorio"
            });
        }

        if (typeof clienteId !== "number") {
            return res.status(400).json({
                error: "El clienteId debe ser un número"
            });
        }

        // Verificar cliente
        const clientes = leerClientes();

        const cliente = clientes.find(
            cliente => cliente.id === clienteId
        );

        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        // Validar productos
        if (!Array.isArray(productos)) {
            return res.status(400).json({
                error: "Los productos deben ser un arreglo"
            });
        }

        if (productos.length === 0) {
            return res.status(400).json({
                error: "El pedido debe contener al menos un producto"
            });
        }

        const productosDisponibles = leerProductos();

        // Validar cada producto
        for (const item of productos) {

            if (
                item.productoId === undefined ||
                item.cantidad === undefined
            ) {
                return res.status(400).json({
                    error: "Cada producto debe tener productoId y cantidad"
                });
            }

            if (typeof item.productoId !== "number") {
                return res.status(400).json({
                    error: "El productoId debe ser un número"
                });
            }

            if (
                typeof item.cantidad !== "number" ||
                item.cantidad <= 0
            ) {
                return res.status(400).json({
                    error: "La cantidad debe ser un número mayor a 0"
                });
            }

            const producto = productosDisponibles.find(
                producto => producto.id === item.productoId
            );

            if (!producto) {
                return res.status(404).json({
                    error: `Producto con ID ${item.productoId} no encontrado`
                });
            }
        }

        // Validar repartidor si se proporciona
        if (repartidorId !== undefined && repartidorId !== null) {

            if (typeof repartidorId !== "number") {
                return res.status(400).json({
                    error: "El repartidorId debe ser un número"
                });
            }

            const repartidores = leerRepartidores();

            const repartidor = repartidores.find(
                repartidor => repartidor.id === repartidorId
            );

            if (!repartidor) {
                return res.status(404).json({
                    error: "Repartidor no encontrado"
                });
            }

            if (!repartidor.disponible) {
                return res.status(400).json({
                    error: "El repartidor no está disponible"
                });
            }
        }

        const pedidos = leerPedidos();

        // Generar nuevo ID
        const nuevoId =
            pedidos.length > 0
                ? Math.max(...pedidos.map(pedido => pedido.id)) + 1
                : 1;

        // Crear pedido utilizando POO
        const nuevoPedido = new Pedido(
            nuevoId,
            clienteId,
            productos,
            repartidorId ?? null,
            "Pendiente"
        );

        pedidos.push(nuevoPedido);

        guardarPedidos(pedidos);

        res.status(201).json({
            mensaje: "Pedido creado correctamente",
            pedido: nuevoPedido
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al crear el pedido"
        });
    }
}

// ==============================
// GET /pedidos/cliente
// ==============================

function obtenerPedidosPorCliente(req, res) {
    try {
        const clienteId = parseInt(req.query.clienteId);

        if (isNaN(clienteId)) {
            return res.status(400).json({
                error: "El clienteId debe ser un número"
            });
        }

        const pedidos = leerPedidos();

        const pedidosCliente = pedidos.filter(
            pedido => pedido.clienteId === clienteId
        );

        res.status(200).json(pedidosCliente);

    } catch (error) {
        res.status(500).json({
            error: "Error al buscar pedidos del cliente"
        });
    }
}

// ==============================
// GET /pedidos/estado
// ==============================

function obtenerPedidosPorEstado(req, res) {
    try {
        const estado = req.query.estado;

        const estadosPermitidos = [
            "Pendiente",
            "Preparado",
            "En camino",
            "Entregado",
            "Cancelado"
        ];

        if (!estado) {
            return res.status(400).json({
                error: "Debe indicar un estado"
            });
        }

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                error: "Estado no válido"
            });
        }

        const pedidos = leerPedidos();

        const pedidosEstado = pedidos.filter(
            pedido => pedido.estado === estado
        );

        res.status(200).json(pedidosEstado);

    } catch (error) {
        res.status(500).json({
            error: "Error al buscar pedidos por estado"
        });
    }
}

// ==============================
// GET /pedidos/filtro
// ==============================

function obtenerPedidosPorFiltro(req, res) {
    try {
        const clienteId = parseInt(req.query.clienteId);
        const estado = req.query.estado;

        const estadosPermitidos = [
            "Pendiente",
            "Preparado",
            "En camino",
            "Entregado",
            "Cancelado"
        ];

        if (isNaN(clienteId)) {
            return res.status(400).json({
                error: "El clienteId debe ser un número"
            });
        }

        if (!estado) {
            return res.status(400).json({
                error: "Debe indicar un estado"
            });
        }

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                error: "Estado no válido"
            });
        }

        const pedidos = leerPedidos();

        const pedidosFiltrados = pedidos.filter(
            pedido =>
                pedido.clienteId === clienteId &&
                pedido.estado === estado
        );

        res.status(200).json(pedidosFiltrados);

    } catch (error) {
        res.status(500).json({
            error: "Error al buscar pedidos por cliente y estado"
        });
    }
}

// ==============================
// GET /pedidos/:id
// ==============================

function obtenerPedidoPorId(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El ID debe ser un número"
            });
        }

        const pedidos = leerPedidos();

        const pedido = pedidos.find(
            pedido => pedido.id === id
        );

        if (!pedido) {
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        res.status(200).json(pedido);

    } catch (error) {
        res.status(500).json({
            error: "Error al buscar el pedido"
        });
    }
}

// ==============================
// PATCH /pedidos/:id/estado
// ==============================

function cambiarEstadoPedido(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El ID debe ser un número"
            });
        }

        const { estado } = req.body;

        const estadosPermitidos = [
            "Pendiente",
            "Preparado",
            "En camino",
            "Entregado",
            "Cancelado"
        ];

        if (!estado) {
            return res.status(400).json({
                error: "El estado es obligatorio"
            });
        }

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                error: "Estado no válido"
            });
        }

        const pedidos = leerPedidos();

        const indice = pedidos.findIndex(
            pedido => pedido.id === id
        );

        if (indice === -1) {
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        const estadoActual = pedidos[indice].estado;

        // Reglas de transición
        const transicionesPermitidas = {
            "Pendiente": ["Preparado", "Cancelado"],
            "Preparado": ["En camino", "Cancelado"],
            "En camino": ["Entregado"],
            "Entregado": [],
            "Cancelado": []
        };

        if (
            !transicionesPermitidas[estadoActual].includes(estado)
        ) {
            return res.status(400).json({
                error: `No se puede cambiar el pedido de ${estadoActual} a ${estado}`
            });
        }

        // Para pasar a En camino debe tener repartidor
        if (
            estado === "En camino" &&
            pedidos[indice].repartidorId === null
        ) {
            return res.status(400).json({
                error: "El pedido debe tener un repartidor asignado para pasar a En camino"
            });
        }

        pedidos[indice].estado = estado;

        guardarPedidos(pedidos);

        res.status(200).json({
            mensaje: "Estado del pedido actualizado correctamente",
            pedido: pedidos[indice]
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al cambiar el estado del pedido"
        });
    }
}

// ==============================
// PATCH /pedidos/:id/repartidor
// ==============================

function asignarRepartidor(req, res) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El ID debe ser un número"
            });
        }

        const { repartidorId } = req.body;

        if (repartidorId === undefined) {
            return res.status(400).json({
                error: "El repartidorId es obligatorio"
            });
        }

        if (typeof repartidorId !== "number") {
            return res.status(400).json({
                error: "El repartidorId debe ser un número"
            });
        }

        const pedidos = leerPedidos();

        const indicePedido = pedidos.findIndex(
            pedido => pedido.id === id
        );

        if (indicePedido === -1) {
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        // No se puede asignar repartidor a pedido cancelado
        if (pedidos[indicePedido].estado === "Cancelado") {
            return res.status(400).json({
                error: "No se puede asignar un repartidor a un pedido cancelado"
            });
        }

        const repartidores = leerRepartidores();

        const repartidor = repartidores.find(
            repartidor => repartidor.id === repartidorId
        );

        if (!repartidor) {
            return res.status(404).json({
                error: "Repartidor no encontrado"
            });
        }

        if (!repartidor.disponible) {
            return res.status(400).json({
                error: "El repartidor no está disponible"
            });
        }

        pedidos[indicePedido].repartidorId = repartidorId;

        guardarPedidos(pedidos);

        res.status(200).json({
            mensaje: "Repartidor asignado correctamente",
            pedido: pedidos[indicePedido]
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al asignar el repartidor"
        });
    }
}

module.exports = {
    obtenerPedidos,
    crearPedido,
    obtenerPedidosPorCliente,
    obtenerPedidosPorEstado,
    obtenerPedidosPorFiltro,
    obtenerPedidoPorId,
    cambiarEstadoPedido,
    asignarRepartidor
};