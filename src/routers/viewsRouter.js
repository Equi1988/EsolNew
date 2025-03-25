// routers/viewsRouter.js
const express = require("express");
const ProductsManager = require("../managers/productsManager");
const CartManager = require ("../managers/CartManager");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});

router.get("/products", async (req, res) => {
    const products = await ProductsManager.getProducts();
    res.render("products", { products });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

router.get("/api/carts/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await CartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const product = cart.products.find(p => p.id === parseInt(pid));
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error interno del servidor:", error);
        res.status(500).json({ error: "Error interno del servidor. Por favor, intenta nuevamente más tarde." });
    }
    
});

module.exports = router;
