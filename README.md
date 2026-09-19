# FreshRoute

## Descripción del proyecto

FreshRoute es una API REST desarrollada para gestionar la distribución de pedidos de alimentos destinados a restaurantes.

El sistema permite administrar clientes, productos, repartidores y pedidos, además de controlar los diferentes estados de entrega de cada pedido.

El proyecto busca resolver el problema de la gestión manual de pedidos, permitiendo centralizar la información y controlar el estado de cada entrega.

---

## Tecnologías utilizadas

* Node.js
* Express
* JavaScript
* JSON para la persistencia de datos
* Thunder Client para pruebas de la API
* Git y GitHub para el control de versiones

> La persistencia de datos se realiza mediante archivos JSON. No se utiliza MongoDB en esta etapa del proyecto.

---

## Estructura del proyecto

```text
FreshRoute/
│
├── data/
│   ├── clientes.json
│   ├── productos.json
│   ├── repartidores.json
│   └── pedidos.json
│
├── routes/
├── controllers/
├── index.js
├── package.json
└── README.md
```

Los archivos JSON contienen la información utilizada por la API.

---

## Instalación

Para ejecutar el proyecto es necesario tener instalado Node.js.

Desde la carpeta del proyecto ejecutar:

```bash
npm install
```

Esto instala las dependencias necesarias del proyecto.

---

## Ejecución

Para iniciar la API:

```bash
node index.js
```

La aplicación se ejecuta en:

```text
http://localhost:3000
```

Para comprobar que la API está funcionando se puede acceder a:

```text
GET http://localhost:3000/
```

Respuesta:

```json
{
    "mensaje": "API FreshRoute funcionando correctamente"
}
```

---

# Recursos de la API

## Clientes

Permite administrar los clientes que realizan pedidos.

### Obtener todos los clientes

**GET**

```text
/clientes
```

Ejemplo:

```text
GET http://localhost:3000/clientes
```

Respuesta:

```json
[
    {
        "id": 1,
        "nombre": "Juan",
        "apellido": "Pérez",
        "telefono": "3815551234",
        "email": "juan@email.com",
        "direccion": "Av. Belgrano 123"
    }
]
```

### Crear un cliente

**POST**

```text
/clientes
```

Body:

```json
{
    "nombre": "Carlos",
    "telefono": "3815559999",
    "email": "carlos@email.com",
    "direccion": "Av. Roca 500"
}
```

Respuesta exitosa:

**201 Created**

### Obtener un cliente

**GET**

```text
/clientes/:id
```

Ejemplo:

```text
GET http://localhost:3000/clientes/1
```

### Modificar un cliente

**PUT**

```text
/clientes/:id
```

Ejemplo:

```text
PUT http://localhost:3000/clientes/1
```

### Eliminar un cliente

**DELETE**

```text
/clientes/:id
```

Ejemplo:

```text
DELETE http://localhost:3000/clientes/1
```

---

# Productos

Permite administrar los productos disponibles para los pedidos.

### Obtener todos los productos

**GET**

```text
/productos
```

### Crear un producto

**POST**

```text
/productos
```

Body:

```json
{
    "nombre": "Caja de zanahorias",
    "precio": 3500,
    "stock": 25
}
```

### Obtener un producto

**GET**

```text
/productos/:id
```

Ejemplo:

```text
GET http://localhost:3000/productos/1
```

### Modificar un producto

**PUT**

```text
/productos/:id
```

### Eliminar un producto

**DELETE**

```text
/productos/:id
```

---

# Repartidores

Permite administrar los repartidores encargados de realizar las entregas.

### Obtener todos los repartidores

**GET**

```text
/repartidores
```

### Crear un repartidor

**POST**

```text
/repartidores
```

Body:

```json
{
    "nombre": "Lucía Fernández",
    "telefono": "3815554444",
    "disponible": true
}
```

### Obtener un repartidor

**GET**

```text
/repartidores/:id
```

### Modificar un repartidor

**PUT**

```text
/repartidores/:id
```

### Eliminar un repartidor

**DELETE**

```text
/repartidores/:id
```

---

# Pedidos

Los pedidos representan las órdenes realizadas por los clientes.

Cada pedido contiene:

* Cliente asociado.
* Uno o más productos.
* Repartidor asignado.
* Estado de entrega.

## Estados disponibles

Los estados permitidos son:

```text
Pendiente
Preparado
En camino
Entregado
Cancelado
```

---

## Obtener todos los pedidos

**GET**

```text
/pedidos
```

---

## Crear un pedido

**POST**

```text
/pedidos
```

Body:

```json
{
    "clienteId": 1,
    "productos": [
        {
            "productoId": 1,
            "cantidad": 2
        }
    ]
}
```

El sistema asigna automáticamente:

```json
"repartidorId": null,
"estado": "Pendiente"
```

---

## Obtener un pedido

**GET**

```text
/pedidos/:id
```

Ejemplo:

```text
GET http://localhost:3000/pedidos/1
```

---

## Cambiar el estado de un pedido

**PATCH**

```text
/pedidos/:id/estado
```

Ejemplo:

```text
PATCH http://localhost:3000/pedidos/1/estado
```

Body:

```json
{
    "estado": "Preparado"
}
```

---

## Asignar un repartidor

**PATCH**

```text
/pedidos/:id/repartidor
```

Ejemplo:

```text
PATCH http://localhost:3000/pedidos/1/repartidor
```

Body:

```json
{
    "repartidorId": 1
}
```

---

# Consultas específicas

## Buscar pedidos por cliente

**GET**

```text
/pedidos/cliente?clienteId=1
```

Ejemplo:

```text
GET http://localhost:3000/pedidos/cliente?clienteId=1
```

---

## Buscar pedidos por estado

**GET**

```text
/pedidos/estado?estado=Entregado
```

Ejemplo:

```text
GET http://localhost:3000/pedidos/estado?estado=Entregado
```

---

## Buscar pedidos por cliente y estado

**GET**

```text
/pedidos/filtro?clienteId=1&estado=Entregado
```

Ejemplo:

```text
GET http://localhost:3000/pedidos/filtro?clienteId=1&estado=Entregado
```

---

# Reglas de negocio

La API implementa las siguientes reglas:

1. Todo pedido debe estar asociado a un cliente existente.
2. Todo pedido debe contener al menos un producto.
3. Los productos incluidos en un pedido deben existir.
4. La cantidad de cada producto debe ser mayor que cero.
5. Solo se puede asignar un repartidor existente.
6. El repartidor debe estar disponible para recibir un pedido.
7. Un pedido cancelado no puede volver a enviarse.
8. Un pedido cancelado no puede recibir un repartidor.
9. Un pedido debe tener un repartidor asignado para pasar a `En camino`.
10. Los estados siguen transiciones determinadas.
11. Un pedido `Entregado` no puede volver a `Pendiente`.
12. Un pedido `Cancelado` no puede continuar con el proceso de entrega.

---

# Transiciones de estados

Las transiciones permitidas son:

```text
Pendiente
    ↓
Preparado
    ↓
En camino
    ↓
Entregado
```

También se puede cancelar un pedido:

```text
Pendiente → Cancelado
Preparado → Cancelado
```

Una vez que un pedido está:

```text
Entregado
```

o

```text
Cancelado
```

no puede continuar a otro estado.

---

# Validación y manejo de errores

La API utiliza códigos HTTP para informar el resultado de las operaciones.

### 200 OK

La operación se realizó correctamente.

### 201 Created

Se creó correctamente un nuevo recurso.

### 400 Bad Request

Los datos enviados son incorrectos o se intenta realizar una operación no permitida.

Ejemplo:

```json
{
    "error": "El repartidor no está disponible"
}
```

### 404 Not Found

El recurso solicitado no existe.

Ejemplo:

```json
{
    "error": "Pedido no encontrado"
}
```

### 500 Internal Server Error

Se produjo un error interno durante el procesamiento de la solicitud.

---

# Pruebas

Las pruebas de los endpoints fueron realizadas utilizando **Thunder Client**.

Se probaron operaciones correctas y situaciones de error, incluyendo:

* Creación de clientes.
* Modificación y eliminación de clientes.
* Creación de productos.
* Modificación y eliminación de productos.
* Creación y modificación de repartidores.
* Creación de pedidos.
* Búsqueda de pedidos.
* Cambio de estados.
* Asignación de repartidores.
* Cliente inexistente.
* Producto inexistente.
* Pedido sin productos.
* Cantidad inválida.
* Repartidor no disponible.
* Pedido cancelado.
* Pedido sin repartidor.
* IDs inválidos.
* Recursos inexistentes.

---

# Control de versiones

El proyecto utiliza Git para el control de versiones y GitHub como repositorio remoto.

El desarrollo actual se encuentra en la rama:

```text
mariana
```

---

# Integrantes

En esta sección se detallará el trabajo realizado por cada integrante del equipo.

* Integrante: Mariana Sosa
* Trabajo realizado: desarrollo y pruebas de la API REST, implementación de recursos, validaciones y reglas de negocio.
