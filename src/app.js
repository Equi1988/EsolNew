const express = require("express");
const { engine } = require("express-handlebars");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const fs = require("fs");
const ProductsManager = require("./managers/ProductsManager");
const { log, errorHandler } = require('../src/middlewares/errorHandler');


// Importar routers
const productsRouter = require("./routers/productsRouter");
const cartsRouter = require("./routers/cartsRouter");

// Configuración inicial
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 8080;

// Ruta del archivo products.json
const productsPath = path.join(__dirname, "data/products.json");

// Leer y guardar productos en JSON
const getProducts = () => {
    if (fs.existsSync(productsPath)) {
        const data = fs.readFileSync(productsPath, "utf-8");
        return JSON.parse(data);
    } else {
        return [];
    }
};
const saveProducts = (products) => {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
};

// Inicializar productos desde JSON
let productos = getProducts();

// Configuración del motor de vistas Handlebars
app.engine("handlebars", engine({
    layoutsDir: path.join(__dirname, "views/layouts"),
    defaultLayout: "main",
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("./src/public"))


// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => {
    res.setHeader("Content-type", "text/plain");
    res.status(200).send("Bienvenido a la API de Productos y Carritos. Usa /api/products o /api/carts");
});

// Ruta para vista en tiempo real
app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

//listado de productos
app.get("/home", async (req, res) => {
    try {
        const productos = await ProductsManager.getProducts(); // Obtener datos del archivo products.json
        console.log("Productos enviados:", productos); // Depuración
        res.render("home", { title: "Lista de Productos", productos });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});


// Configuración de Socket.IO
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Enviar lista inicial de productos
    socket.emit("initialProducts", productos);

    // Agregar un nuevo producto
    socket.on("newProduct", (product) => {
        const newProduct = {
            id: productos.length ? productos[productos.length - 1].id + 1 : 1,
            ...product,
        };
        productos.push(newProduct);
        saveProducts(productos); // Actualizar archivo JSON
        io.emit("newProduct", newProduct); // Enviar a todos los clientes
    });

    // Eliminar un producto
    socket.on("deleteProduct", (id) => {
        productos = productos.filter((product) => product.id !== id);
        saveProducts(productos); // Actualizar archivo JSON
        io.emit("deleteProduct", id); // Notificar a los clientes
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

app.use(errorHandler)

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



