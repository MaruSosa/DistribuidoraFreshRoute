class Pedido {
    constructor(id, clienteId, productos, repartidorId, estado) {
        this.id = id;
        this.clienteId = clienteId;
        this.productos = productos;
        this.repartidorId = repartidorId;
        this.estado = estado;
    }
}

module.exports = Pedido;