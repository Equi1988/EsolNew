const express = require("express");
const { engine } = require("express-handlebars");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const ProductsManager = require("./managers/ProductsManager");
const CartManager= require ("./managers/CartManager");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración de Handlebars
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Inyectar io a los routers
const productsRouter = require("./routers/productsRouter")(io);
const cartsRouter = require("./routers/cartsRouter");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Vistas
app.get("/home", (req, res) => res.render("home", { title: "Home" }));
app.get("/realtimeproducts", async (req, res) => {
    const productos = await ProductsManager.getProducts();
    const cartId = req.cookies?.cartId || null; // Puede ser null
    res.render("realTimeProducts", { title: "Real Time Products", productos, cartId });
});


app.get("/cart/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const cart = await CartManager.getCartById(cartId);

    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }

    res.render("cartView", { cart });
});

app.get('/api/carts/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        // Obtener el carrito utilizando CartManager
        const cart = await CartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Buscar el producto dentro del carrito
        const product = cart.products.find(p => p.id === parseInt(productId));
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        // Devolver el producto como respuesta
        res.json(product);
    } catch (error) {
        console.error('Error interno del servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Socket.IO: manejar conexiones de clientes
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    // Cuando se conectan, enviar productos
    const productos = await ProductsManager.getProducts();
    socket.emit("initialProducts", productos);

    // Cliente solicita productos
    socket.on("requestProducts", async () => {
        const productos = await ProductsManager.getProducts();
        socket.emit("initialProducts", productos);
    });

    // Agregar producto
    socket.on("newProduct", async (product) => {
        await ProductsManager.addProduct(product);
        const updatedProducts = await ProductsManager.getProducts();
        io.emit("initialProducts", updatedProducts); // Refrescar en todos los clientes
    });

    // Eliminar producto
    socket.on("deleteProduct", async (id) => {
        await ProductsManager.deleteProduct(id);
        const updatedProducts = await ProductsManager.getProducts();
        io.emit("initialProducts", updatedProducts); // Refrescar en todos los clientes
    });

    socket.on("disconnect", () => console.log("Cliente desconectado"));
});


server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


