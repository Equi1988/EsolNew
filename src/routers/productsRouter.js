const express = require("express");
const ProductsManager = require("../managers/productsManager");
const { 
    validateRequiredFields, 
    validateUniqueFieldsPost, 
    validateUniqueFieldsPut 
} = require("../middlewares/validators");

module.exports = (io) => {
    const router = express.Router();
    const requiredFields = ["title", "description", "price", "code", "stock", "category"];

    router.get("/", async (req, res) => {
        const products = await ProductsManager.getProducts();
        res.json(products);
    });

    router.get("/:pid", async (req, res) => {
        const product = await ProductsManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    });

    router.post("/", 
        validateRequiredFields(requiredFields), 
        validateUniqueFieldsPost, 
        async (req, res) => {
            const { title, description, price, code, stock, category } = req.body;
            try {
                const product = await ProductsManager.addProduct({ title, description, price, code, stock, category });
                io.emit("refreshProducts");
                res.status(201).json({ product });
            } catch (error) {
                res.status(500).json({ error: "Error interno del servidor." });
            }
        }
    );

    router.put("/:pid", 
        validateRequiredFields(requiredFields), 
        validateUniqueFieldsPut, 
        async (req, res) => {
            const { title, description, price, code, stock, category } = req.body;
            try {
                const productToUpdate = await ProductsManager.getProductById(req.params.pid);
                if (!productToUpdate) {
                    return res.status(404).json({ error: "Producto no encontrado" });
                }
                const updatedProduct = await ProductsManager.updateProduct(req.params.pid, { title, description, price, code, stock, category });
                io.emit("refreshProducts");
                res.status(200).json({ updatedProduct });
            } catch (error) {
                res.status(500).json({ error: "Error interno del servidor." });
            }
        }
    );

    router.delete("/:pid", async (req, res) => {
        try {
            const product = await ProductsManager.getProductById(req.params.pid);
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            await ProductsManager.deleteProduct(req.params.pid);
            io.emit("refreshProducts");
            res.json({ status: "Deleted" });
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor." });
        }
    });

    return router;
};





