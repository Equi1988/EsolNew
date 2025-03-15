
const express = require("express");
const productsRouter = require("./routers/productsRouter.js");
const cartsRouter = require("./routers/cartsRouter.js");

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => {
    res.setHeader("Content-type", "text/plain");
    res.status(200).send("Bienvenido a la API de Productos y Carritos. Usa /api/products o /api/carts");
});

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});



