const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "API FreshRoute funcionando correctamente"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});