
// const express = require("express");
// const productsRouter = require("./routers/productsRouter.js");
// const cartsRouter = require("./routers/cartsRouter.js");

// const PORT = 8080;
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api/products", productsRouter);
// app.use("/api/carts", cartsRouter);

// app.get("/", (req, res) => {
//     res.setHeader("Content-type", "text/plain");
//     res.status(200).send("Bienvenido a la API de Productos y Carritos. Usa /api/products o /api/carts");
// });

// const server = app.listen(PORT, () => {
//     console.log(`Server escuchando en puerto ${PORT}`);
// });

const express = require("express");
const { engine } = require("express-handlebars");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

// Importar routers
const productsRouter = require("./routers/productsRouter.js");
const cartsRouter = require("./routers/cartsRouter.js");

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 8080;

// Configuración del motor de vistas Handlebars
app.engine("handlebars", engine({
    layoutsDir: path.join(__dirname, "views/layouts"), // Carpeta de layouts
    defaultLayout: "main",
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.get("/", (req, res) => {
    res.setHeader("Content-type", "text/plain");
    res.status(200).send("Bienvenido a la API de Productos y Carritos. Usa /api/products o /api/carts");
});

// Ruta de vista para productos en tiempo real

app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

// Configuración de Socket.IO
let productos = [];

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    socket.emit("initialProducts", productos);

    socket.on("newProduct", (product) => {
        productos.push(product);
        io.emit("newProduct", product);
    });

    socket.on("deleteProduct", (id) => {
        productos = productos.filter((product) => product.id !== id);
        io.emit("deleteProduct", id);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



