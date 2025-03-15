const Router = require('express').Router;
const CartManager = require("../managers/CartManager");
const router = Router();

router.get('/', async (req, res) => {
    try {
        let carts = await CartManager.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error retrieving carts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/', async (req, res) => {
    try {
        let cart = await CartManager.createCart();
        res.status(201).json({ cart });
    } catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        let cart = await CartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        res.status(200).json({ cart });
    } catch (error) {
        console.error(`Error retrieving cart ${req.params.cid}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        let cart = await CartManager.addProductToCart(req.params.cid, req.params.pid);
        res.status(201).json({ cart });
    } catch (error) {
        console.error(`Error adding product ${req.params.pid} to cart ${req.params.cid}:`, error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

