const express = require("express");
const { engine } = require("express-handlebars");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const ProductsManager = require("./managers/productsManager");
const CartManager = require("./managers/CartManager");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 8080;

// Variable global para productos
let productos = [];

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
const viewsRouter = require("./routers/viewsRouter");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas
app.get("/home", (req, res) => res.render("home", { title: "Home" }));
app.get("/realtimeproducts", async (req, res) => {
    productos = await ProductsManager.getProducts(); // Actualizar la variable con datos actuales
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

app.post('/api/carts/:cartId/product/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        // Validar existencia del carrito
        const cart = await CartManager.getCartById(cartId);
        if (!cart) {
            console.error(`Carrito con ID ${cartId} no encontrado.`);
            return res.status(404).json({ error: `Carrito con ID ${cartId} no existe.` });
        }

        // Validar existencia del producto
        const product = await ProductsManager.getProductById(productId);
        if (!product) {
            console.error(`Producto con ID ${productId} no encontrado.`);
            return res.status(404).json({ error: `Producto con ID ${productId} no existe.` });
        }

        // Agregar producto al carrito
        await CartManager.addProductToCart(cartId, productId);
        res.status(201).json({ message: 'Producto agregado exitosamente al carrito.' });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});



// Socket.IO
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    // Inicializar productos desde ProductsManager
    productos = await ProductsManager.getProducts();
    socket.emit("initialProducts", productos);

    // Evento para agregar producto
    socket.on("newProduct", async (product) => {
        const { title, description, price, code, stock, category } = product;

        // Validaciones
        if (!title || !description || !price || !code || !stock || !category) {
            return socket.emit("errorMessage", "Todos los campos son obligatorios");
        }
        if (typeof title !== "string" || typeof description !== "string" || typeof code !== "string" || typeof category !== "string") {
            return socket.emit("errorMessage", "title, description, code y category deben ser strings");
        }
        if (typeof price !== "number" || typeof stock !== "number") {
            return socket.emit("errorMessage", "price y stock deben ser números");
        }

        // Verificar si el código existe
        const codeExists = productos.some(p => p.code === code);
        if (codeExists) {
            return socket.emit("errorMessage", "El código ya existe en otro producto");
        }

        // Agregar el nuevo producto
        const newProduct = { id: productos.length + 1, ...product };
        productos.push(newProduct);
        await ProductsManager.addProduct(newProduct); // Guardar en el almacenamiento
        io.emit("initialProducts", productos);
    });

    // Evento para eliminar producto
    socket.on("deleteProduct", async (id) => {
        const exists = productos.some(p => p.id === parseInt(id));
        if (!exists) {
            return socket.emit("errorMessage", "Producto no encontrado para eliminar");
        }
        productos = productos.filter(p => p.id !== parseInt(id));
        await ProductsManager.deleteProduct(id); // Eliminar del almacenamiento
        io.emit("initialProducts", productos);
    });

    socket.on("disconnect", () => console.log("Cliente desconectado"));
});

// Iniciar el servidor
server.listen(PORT, async () => {
    // Cargar productos al iniciar
    productos = await ProductsManager.getProducts();
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
