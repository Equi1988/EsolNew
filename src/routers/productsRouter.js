const ProductsManager = require("../managers/ProductsManager");
const Router = require('express').Router;
const router = Router();

router.get('/', async (req, res) => {
    try {
        console.log("GET /api/products request received");
        let products = await ProductsManager.getProducts();
        console.log("Products retrieved:", products);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({products});
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({error: `Internal server error`});
    }
});

router.get('/:pid', async (req, res) => {
    try {
        console.log(`GET /api/products/${req.params.pid} request received`);
        let product = await ProductsManager.getProductById(req.params.pid);
        console.log("Product retrieved:", product);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({product});
    } catch (error) {
        console.error(`Error retrieving product ${req.params.pid}:`, error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({error: `Internal server error`});
    }
});

router.post("/", async (req, res) => {
    try {
        console.log("POST /api/products request received");
        let product = await ProductsManager.addProduct(req.body);
        console.log("Product added:", product);
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({product});
    } catch (error) {
        console.error("Error adding product:", error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({error: `Internal server error`});
    }
});

router.put("/:pid", async (req, res) => {
    try {
        console.log(`PUT /api/products/${req.params.pid} request received`);
        let updatedProduct = await ProductsManager.updateProduct(req.params.pid, req.body);
        console.log("Product updated:", updatedProduct);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({updatedProduct});
    } catch (error) {
        console.error(`Error updating product ${req.params.pid}:`, error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({error: `Internal server error`});
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        console.log(`DELETE /api/products/${req.params.pid} request received`);
        await ProductsManager.deleteProduct(req.params.pid);
        console.log(`Product ${req.params.pid} deleted`);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({message: "Product deleted"});
    } catch (error) {
        console.error(`Error deleting product ${req.params.pid}:`, error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({error: `Internal server error`});
    }
});

module.exports = router;



