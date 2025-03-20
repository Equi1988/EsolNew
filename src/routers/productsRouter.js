// // routers/productsRouter.js
// const express = require("express");
// const ProductsManager = require("../managers/ProductsManager");

// module.exports = (io) => {
//     const router = express.Router();

//     router.get("/", async (req, res) => {
//         const products = await ProductsManager.getProducts();
//         res.json(products);
//     });

//     router.get("/:pid", async (req, res) => {
//         const product = await ProductsManager.getProductById(req.params.pid);
//         res.json(product);
//     });

//     router.post("/", async (req, res) => {
//         const product = await ProductsManager.addProduct(req.body);
//         io.emit("refreshProducts");
//         res.status(201).json(product);
//     });

//     router.put("/:pid", async (req, res) => {
//         const updated = await ProductsManager.updateProduct(req.params.pid, req.body);
//         io.emit("refreshProducts");
//         res.json(updated);
//     });

//     router.delete("/:pid", async (req, res) => {
//         await ProductsManager.deleteProduct(req.params.pid);
//         io.emit("refreshProducts");
//         res.json({ status: "Deleted" });
//     });

//     return router;
// };

const express = require("express");
const ProductsManager = require("../managers/ProductsManager");
const CartManager = require("../managers/CartManager");

module.exports = (io) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        const products = await ProductsManager.getProducts();
        res.json(products);
    });

    router.get("/:pid", async (req, res) => {
        const product = await ProductsManager.getProductById(req.params.pid);
        res.json(product);
    });

    router.post("/", async (req, res) => {
        const product = await ProductsManager.addProduct(req.body);
        io.emit("refreshProducts");
        res.status(201).json(product);
    });

    router.put("/:pid", async (req, res) => {
        const updated = await ProductsManager.updateProduct(req.params.pid, req.body);
        io.emit("refreshProducts");
        res.json(updated);
    });

    router.delete("/:pid", async (req, res) => {
        await ProductsManager.deleteProduct(req.params.pid);
        io.emit("refreshProducts"); // ✔️ io sí es accesible
        res.json({ status: "Deleted" });
    });
    

    // Ruta para agregar un producto al carrito
    router.post("/:cartId/product/:productId", async (req, res) => {
        const { cartId, productId } = req.params;

        try {
            const updatedCart = await CartManager.addProductToCart(cartId, productId);
            io.emit("refreshCart", updatedCart);  // Emitir evento para actualizar el carrito en tiempo real
            res.status(201).json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};



