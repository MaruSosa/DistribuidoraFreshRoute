const express = require("express");
const fs = require("fs");
const path = require("path");

const clientesRoutes = require("./routes/clientesRoutes");

const app = express();

app.use(express.json());

app.use("/clientes", clientesRoutes);
// Rutas de los archivos JSON
const clientesPath = path.join(__dirname, "data", "clientes.json");
const productosPath = path.join(__dirname, "data", "productos.json");
const repartidoresPath = path.join(__dirname, "data", "repartidores.json");
const pedidosPath = path.join(__dirname, "data", "pedidos.json");

// Función para leer un archivo JSON
function leerJSON(ruta) {
  const datos = fs.readFileSync(ruta, "utf-8");
  return JSON.parse(datos);
}

// GET principal
app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "API FreshRoute funcionando correctamente",
  });
});

// GET todos los clientes
app.get("/clientes", (req, res) => {
  try {
    const clientes = leerJSON(clientesPath);

    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({
      error: "Error al leer los clientes",
    });
  }
});

// POST crear cliente
app.post("/clientes", (req, res) => {
  try {
    const { nombre, telefono, email, direccion } = req.body;

    // Validar campos obligatorios
    if (!nombre || !telefono || !email || !direccion) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Leer clientes actuales
    const clientes = leerJSON(clientesPath);

    // Crear nuevo ID
    const nuevoId =
      clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1;

    // Crear cliente
    const nuevoCliente = {
      id: nuevoId,
      nombre: nombre,
      telefono: telefono,
      email: email,
      direccion: direccion,
    };

    // Agregar cliente
    clientes.push(nuevoCliente);

    // Guardar en JSON
    fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));

    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear el cliente",
    });
  }
});

// GET cliente por ID
app.get("/clientes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar que el ID sea un número
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const clientes = leerJSON(clientesPath);

    // Buscar cliente
    const cliente = clientes.find((cliente) => cliente.id === id);

    // Verificar si existe
    if (!cliente) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar el cliente",
    });
  }
});

// PUT modificar cliente
app.put("/clientes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const { nombre, telefono, email, direccion } = req.body;

    // Validar campos obligatorios
    if (!nombre || !telefono || !email || !direccion) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Leer clientes
    const clientes = leerJSON(clientesPath);

    // Buscar cliente
    const indice = clientes.findIndex((cliente) => cliente.id === id);

    // Verificar existencia
    if (indice === -1) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    // Actualizar cliente
    clientes[indice] = {
      id: id,
      nombre: nombre,
      telefono: telefono,
      email: email,
      direccion: direccion,
    };

    // Guardar cambios
    fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));

    // Responder con el cliente actualizado
    res.status(200).json(clientes[indice]);
  } catch (error) {
    res.status(500).json({
      error: "Error al modificar el cliente",
    });
  }
});
// DELETE eliminar cliente
app.delete("/clientes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    // Leer clientes
    const clientes = leerJSON(clientesPath);

    // Buscar cliente
    const indice = clientes.findIndex((cliente) => cliente.id === id);

    // Verificar existencia
    if (indice === -1) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    // Eliminar cliente
    const clienteEliminado = clientes.splice(indice, 1);

    // Guardar cambios
    fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));

    // Responder
    res.status(200).json({
      mensaje: "Cliente eliminado correctamente",
      cliente: clienteEliminado[0],
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el cliente",
    });
  }
});
// GET todos los productos
app.get("/productos", (req, res) => {
  try {
    const productos = leerJSON(productosPath);

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      error: "Error al leer los productos",
    });
  }
});
// POST crear producto
app.post("/productos", (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    // Validar campos obligatorios
    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Validar tipos
    if (typeof nombre !== "string") {
      return res.status(400).json({
        error: "El nombre debe ser texto",
      });
    }

    if (typeof precio !== "number") {
      return res.status(400).json({
        error: "El precio debe ser un número",
      });
    }

    if (typeof stock !== "number") {
      return res.status(400).json({
        error: "El stock debe ser un número",
      });
    }

    // Validar valores
    if (precio < 0 || stock < 0) {
      return res.status(400).json({
        error: "El precio y el stock no pueden ser negativos",
      });
    }

    // Leer productos actuales
    const productos = leerJSON(productosPath);

    // Crear nuevo ID
    const nuevoId =
      productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

    // Crear producto
    const nuevoProducto = {
      id: nuevoId,
      nombre: nombre,
      precio: precio,
      stock: stock,
    };

    // Agregar producto
    productos.push(nuevoProducto);

    // Guardar en JSON
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear el producto",
    });
  }
});
// GET producto por ID
app.get("/productos/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar que el ID sea un número
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    // Leer productos
    const productos = leerJSON(productosPath);

    // Buscar producto
    const producto = productos.find((producto) => producto.id === id);

    // Verificar si existe
    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar el producto",
    });
  }
});
// PUT modificar producto
app.put("/productos/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const { nombre, precio, stock } = req.body;

    // Validar campos obligatorios
    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Validar tipos
    if (typeof nombre !== "string") {
      return res.status(400).json({
        error: "El nombre debe ser texto",
      });
    }

    if (typeof precio !== "number") {
      return res.status(400).json({
        error: "El precio debe ser un número",
      });
    }

    if (typeof stock !== "number") {
      return res.status(400).json({
        error: "El stock debe ser un número",
      });
    }

    // Validar valores
    if (precio < 0 || stock < 0) {
      return res.status(400).json({
        error: "El precio y el stock no pueden ser negativos",
      });
    }

    // Leer productos
    const productos = leerJSON(productosPath);

    // Buscar producto
    const indice = productos.findIndex((producto) => producto.id === id);

    // Verificar existencia
    if (indice === -1) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    // Actualizar producto
    productos[indice] = {
      id: id,
      nombre: nombre,
      precio: precio,
      stock: stock,
    };

    // Guardar cambios
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));

    res.status(200).json(productos[indice]);
  } catch (error) {
    res.status(500).json({
      error: "Error al modificar el producto",
    });
  }
});
// DELETE eliminar producto
app.delete("/productos/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    // Leer productos
    const productos = leerJSON(productosPath);

    // Buscar producto
    const indice = productos.findIndex((producto) => producto.id === id);

    // Verificar existencia
    if (indice === -1) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    // Eliminar producto
    const productoEliminado = productos.splice(indice, 1);

    // Guardar cambios
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));

    // Responder
    res.status(200).json({
      mensaje: "Producto eliminado correctamente",
      producto: productoEliminado[0],
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el producto",
    });
  }
});
// GET todos los repartidores
app.get("/repartidores", (req, res) => {
  try {
    const repartidores = leerJSON(repartidoresPath);

    res.status(200).json(repartidores);
  } catch (error) {
    res.status(500).json({
      error: "Error al leer los repartidores",
    });
  }
});
// POST crear repartidor
app.post("/repartidores", (req, res) => {
  try {
    const { nombre, telefono, disponible } = req.body;

    // Validar campos obligatorios
    if (!nombre || !telefono || disponible === undefined) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Validar tipos
    if (typeof nombre !== "string") {
      return res.status(400).json({
        error: "El nombre debe ser texto",
      });
    }

    if (typeof telefono !== "string") {
      return res.status(400).json({
        error: "El teléfono debe ser texto",
      });
    }

    if (typeof disponible !== "boolean") {
      return res.status(400).json({
        error: "El campo disponible debe ser true o false",
      });
    }

    // Leer repartidores
    const repartidores = leerJSON(repartidoresPath);

    // Crear nuevo ID
    const nuevoId =
      repartidores.length > 0
        ? repartidores[repartidores.length - 1].id + 1
        : 1;

    // Crear repartidor
    const nuevoRepartidor = {
      id: nuevoId,
      nombre: nombre,
      telefono: telefono,
      disponible: disponible,
    };

    // Agregar repartidor
    repartidores.push(nuevoRepartidor);

    // Guardar en JSON
    fs.writeFileSync(repartidoresPath, JSON.stringify(repartidores, null, 2));

    res.status(201).json(nuevoRepartidor);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear el repartidor",
    });
  }
});
// GET repartidor por ID
app.get("/repartidores/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    // Leer repartidores
    const repartidores = leerJSON(repartidoresPath);

    // Buscar repartidor
    const repartidor = repartidores.find((repartidor) => repartidor.id === id);

    // Verificar existencia
    if (!repartidor) {
      return res.status(404).json({
        error: "Repartidor no encontrado",
      });
    }

    res.status(200).json(repartidor);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar el repartidor",
    });
  }
});
// PUT modificar repartidor
app.put("/repartidores/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const { nombre, telefono, disponible } = req.body;

    // Validar campos obligatorios
    if (!nombre || !telefono || disponible === undefined) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Validar tipos
    if (typeof nombre !== "string") {
      return res.status(400).json({
        error: "El nombre debe ser texto",
      });
    }

    if (typeof telefono !== "string") {
      return res.status(400).json({
        error: "El teléfono debe ser texto",
      });
    }

    if (typeof disponible !== "boolean") {
      return res.status(400).json({
        error: "El campo disponible debe ser true o false",
      });
    }

    // Leer repartidores
    const repartidores = leerJSON(repartidoresPath);

    // Buscar repartidor
    const indice = repartidores.findIndex((repartidor) => repartidor.id === id);

    // Verificar existencia
    if (indice === -1) {
      return res.status(404).json({
        error: "Repartidor no encontrado",
      });
    }

    // Actualizar repartidor
    repartidores[indice] = {
      id: id,
      nombre: nombre,
      telefono: telefono,
      disponible: disponible,
    };

    // Guardar cambios
    fs.writeFileSync(repartidoresPath, JSON.stringify(repartidores, null, 2));

    res.status(200).json(repartidores[indice]);
  } catch (error) {
    res.status(500).json({
      error: "Error al modificar el repartidor",
    });
  }
});
// DELETE eliminar repartidor
app.delete("/repartidores/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    // Leer repartidores
    const repartidores = leerJSON(repartidoresPath);

    // Buscar repartidor
    const indice = repartidores.findIndex((repartidor) => repartidor.id === id);

    // Verificar existencia
    if (indice === -1) {
      return res.status(404).json({
        error: "Repartidor no encontrado",
      });
    }

    // Eliminar repartidor
    const repartidorEliminado = repartidores.splice(indice, 1);

    // Guardar cambios
    fs.writeFileSync(repartidoresPath, JSON.stringify(repartidores, null, 2));

    res.status(200).json({
      mensaje: "Repartidor eliminado correctamente",
      repartidor: repartidorEliminado[0],
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el repartidor",
    });
  }
});
// GET todos los pedidos
app.get("/pedidos", (req, res) => {
  try {
    const pedidos = leerJSON(pedidosPath);

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({
      error: "Error al leer los pedidos",
    });
  }
});
// POST crear pedido
app.post("/pedidos", (req, res) => {
  try {
    const { clienteId, productos, repartidorId } = req.body;

    // Validar clienteId
    if (clienteId === undefined) {
      return res.status(400).json({
        error: "El clienteId es obligatorio",
      });
    }

    if (typeof clienteId !== "number") {
      return res.status(400).json({
        error: "El clienteId debe ser un número",
      });
    }

    // Leer clientes
    const clientes = leerJSON(clientesPath);

    // Verificar que exista el cliente
    const cliente = clientes.find((cliente) => cliente.id === clienteId);

    if (!cliente) {
      return res.status(404).json({
        error: "Cliente no encontrado",
      });
    }

    // Validar productos
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        error: "El pedido debe contener al menos un producto",
      });
    }

    // Leer productos disponibles
    const productosDisponibles = leerJSON(productosPath);

    // Verificar cada producto
    for (const item of productos) {
      if (item.productoId === undefined || item.cantidad === undefined) {
        return res.status(400).json({
          error: "Cada producto debe tener productoId y cantidad",
        });
      }

      if (typeof item.productoId !== "number") {
        return res.status(400).json({
          error: "El productoId debe ser un número",
        });
      }

      if (typeof item.cantidad !== "number" || item.cantidad <= 0) {
        return res.status(400).json({
          error: "La cantidad debe ser un número mayor a 0",
        });
      }

      const productoExiste = productosDisponibles.find(
        (producto) => producto.id === item.productoId,
      );

      if (!productoExiste) {
        return res.status(404).json({
          error: `Producto con ID ${item.productoId} no encontrado`,
        });
      }
    }

    // Leer repartidores
    const repartidores = leerJSON(repartidoresPath);

    // Validar repartidor si se envió
    if (repartidorId !== undefined && repartidorId !== null) {
      if (typeof repartidorId !== "number") {
        return res.status(400).json({
          error: "El repartidorId debe ser un número",
        });
      }

      const repartidor = repartidores.find(
        (repartidor) => repartidor.id === repartidorId,
      );

      if (!repartidor) {
        return res.status(404).json({
          error: "Repartidor no encontrado",
        });
      }

      // Regla de negocio
      if (!repartidor.disponible) {
        return res.status(400).json({
          error: "El repartidor no está disponible",
        });
      }
    }

    // Leer pedidos actuales
    const pedidos = leerJSON(pedidosPath);

    // Crear nuevo ID
    const nuevoId = pedidos.length > 0 ? pedidos[pedidos.length - 1].id + 1 : 1;

    // Crear nuevo pedido
    const nuevoPedido = {
      id: nuevoId,
      clienteId: clienteId,
      productos: productos,
      repartidorId: repartidorId ?? null,
      estado: "Pendiente",
    };

    // Agregar pedido
    pedidos.push(nuevoPedido);

    // Guardar pedido
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));

    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear el pedido",
    });
  }
});
// GET pedidos por cliente
app.get("/pedidos/cliente", (req, res) => {
  try {
    const clienteId = parseInt(req.query.clienteId);

    // Validar clienteId
    if (isNaN(clienteId)) {
      return res.status(400).json({
        error: "El clienteId debe ser un número",
      });
    }

    const pedidos = leerJSON(pedidosPath);

    const pedidosCliente = pedidos.filter(
      (pedido) => pedido.clienteId === clienteId,
    );

    res.status(200).json(pedidosCliente);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar pedidos del cliente",
    });
  }
});
// GET pedidos por estado
app.get("/pedidos/estado", (req, res) => {
  try {
    const estado = req.query.estado;

    const estadosPermitidos = [
      "Pendiente",
      "Preparado",
      "En camino",
      "Entregado",
      "Cancelado",
    ];

    if (!estado) {
      return res.status(400).json({
        error: "Debe indicar un estado",
      });
    }

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        error: "Estado no válido",
      });
    }

    const pedidos = leerJSON(pedidosPath);

    const pedidosEstado = pedidos.filter((pedido) => pedido.estado === estado);

    res.status(200).json(pedidosEstado);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar pedidos por estado",
    });
  }
});
// GET pedidos por cliente y estado
app.get("/pedidos/filtro", (req, res) => {
  try {
    const clienteId = parseInt(req.query.clienteId);
    const estado = req.query.estado;

    const estadosPermitidos = [
      "Pendiente",
      "Preparado",
      "En camino",
      "Entregado",
      "Cancelado",
    ];

    // Validar clienteId
    if (isNaN(clienteId)) {
      return res.status(400).json({
        error: "El clienteId debe ser un número",
      });
    }

    // Validar estado
    if (!estado) {
      return res.status(400).json({
        error: "Debe indicar un estado",
      });
    }

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        error: "Estado no válido",
      });
    }

    // Leer pedidos
    const pedidos = leerJSON(pedidosPath);

    // Filtrar por cliente y estado
    const pedidosFiltrados = pedidos.filter(
      (pedido) => pedido.clienteId === clienteId && pedido.estado === estado,
    );

    res.status(200).json(pedidosFiltrados);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar pedidos por cliente y estado",
    });
  }
});
// GET pedido por ID
app.get("/pedidos/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const pedidos = leerJSON(pedidosPath);

    const pedido = pedidos.find((pedido) => pedido.id === id);

    if (!pedido) {
      return res.status(404).json({
        error: "Pedido no encontrado",
      });
    }

    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({
      error: "Error al buscar el pedido",
    });
  }
});
// PATCH cambiar estado del pedido
app.patch("/pedidos/:id/estado", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const { estado } = req.body;

    // Estados permitidos
    const estadosPermitidos = [
      "Pendiente",
      "Preparado",
      "En camino",
      "Entregado",
      "Cancelado",
    ];

    // Validar que se haya enviado un estado
    if (!estado) {
      return res.status(400).json({
        error: "El estado es obligatorio",
      });
    }

    // Validar que el estado sea válido
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        error: "Estado no válido",
      });
    }

    // Leer pedidos
    const pedidos = leerJSON(pedidosPath);

    // Buscar pedido
    const indice = pedidos.findIndex((pedido) => pedido.id === id);

    // Verificar que exista
    if (indice === -1) {
      return res.status(404).json({
        error: "Pedido no encontrado",
      });
    }

    const estadoActual = pedidos[indice].estado;

    // Validar transición de estado
    const transicionesPermitidas = {
      Pendiente: ["Preparado", "Cancelado"],
      Preparado: ["En camino", "Cancelado"],
      "En camino": ["Entregado"],
      Entregado: [],
      Cancelado: [],
    };

    if (!transicionesPermitidas[estadoActual].includes(estado)) {
      return res.status(400).json({
        error: `No se puede cambiar el pedido de ${estadoActual} a ${estado}`,
      });
    }
    // Para pasar a "En camino" debe tener un repartidor asignado
    if (estado === "En camino" && pedidos[indice].repartidorId === null) {
      return res.status(400).json({
        error:
          "El pedido debe tener un repartidor asignado para pasar a En camino",
      });
    }
    // Actualizar estado
    pedidos[indice].estado = estado;

    // Guardar cambios
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));

    // Responder
    res.status(200).json({
      mensaje: "Estado del pedido actualizado correctamente",
      pedido: pedidos[indice],
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al cambiar el estado del pedido",
    });
  }
});
// PATCH asignar repartidor al pedido
app.patch("/pedidos/:id/repartidor", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Validar ID del pedido
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número",
      });
    }

    const { repartidorId } = req.body;

    // Validar repartidorId
    if (repartidorId === undefined) {
      return res.status(400).json({
        error: "El repartidorId es obligatorio",
      });
    }

    if (typeof repartidorId !== "number") {
      return res.status(400).json({
        error: "El repartidorId debe ser un número",
      });
    }

    // Leer pedidos
    const pedidos = leerJSON(pedidosPath);

    // Buscar pedido
    const indicePedido = pedidos.findIndex((pedido) => pedido.id === id);

    if (indicePedido === -1) {
      return res.status(404).json({
        error: "Pedido no encontrado",
      });
    }
    // Validar que el pedido no esté cancelado
    if (pedidos[indicePedido].estado === "Cancelado") {
      return res.status(400).json({
        error: "No se puede asignar un repartidor a un pedido cancelado",
      });
    }
    // Leer repartidores
    const repartidores = leerJSON(repartidoresPath);

    // Buscar repartidor
    const repartidor = repartidores.find(
      (repartidor) => repartidor.id === repartidorId,
    );

    if (!repartidor) {
      return res.status(404).json({
        error: "Repartidor no encontrado",
      });
    }

    // Regla de negocio:
    // solo un repartidor disponible puede recibir un pedido
    if (!repartidor.disponible) {
      return res.status(400).json({
        error: "El repartidor no está disponible",
      });
    }

    // Asignar repartidor
    pedidos[indicePedido].repartidorId = repartidorId;

    // Guardar cambios
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));

    // Responder
    res.status(200).json({
      mensaje: "Repartidor asignado correctamente",
      pedido: pedidos[indicePedido],
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al asignar el repartidor",
    });
  }
});
// Puerto
const PORT = 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`FreshRoute API funcionando en http://localhost:${PORT}`);
});
