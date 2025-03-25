const express = require("express");
const ProductsManager = require("../managers/productsManager");
const { 
    validateRequiredFields, 
    validateUniqueFieldsPost, 
    validateUniqueFieldsPut 
} = require("../middlewares/validators");

// Normalizador de category
const normalizeCategory = (req, res, next) => {
    let { category } = req.body;
    if (typeof category === 'string') {
        req.body.category = [category];
    }
    next();
};

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
        normalizeCategory,
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
        normalizeCategory,
        validateRequiredFields(requiredFields), 
        validateUniqueFieldsPut, 
        async (req, res) => {
            const { title, description, price, code, stock, category } = req.body;
    
            // Solo pasamos los campos que están presentes en la solicitud
            const updatedFields = {};
    
            if (title) updatedFields.title = title;
            if (description) updatedFields.description = description;
            if (price) updatedFields.price = price;
            if (code) updatedFields.code = code;
            if (stock) updatedFields.stock = stock;
            if (category) updatedFields.category = category;
    
            try {
                // Buscamos el producto por su ID
                const productToUpdate = await ProductsManager.getProductById(req.params.pid);
                if (!productToUpdate) {
                    return res.status(404).json({ error: "Producto no encontrado" });
                }
    
                // Actualizamos solo los campos proporcionados
                const updatedProduct = await ProductsManager.updateProduct(req.params.pid, updatedFields);
                
                // Emite el evento para refrescar productos en el cliente
                io.emit("refreshProducts");
                
                // Respondemos con el producto actualizado
                res.status(200).json({ updatedProduct });
            } catch (error) {
                console.error(error);
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





