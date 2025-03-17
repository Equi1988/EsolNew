const Router = require('express').Router;
const CartManager = require("../managers/CartManager");
const router = Router();

// Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await CartManager.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error retrieving carts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const cart = await CartManager.createCart();
        res.status(201).json({ cart });
    } catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Obtener un carrito específico por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        res.status(200).json(cart);
    } catch (error) {
        console.error(`Error retrieving cart ${req.params.cid}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Agregar un producto a un carrito específico
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await CartManager.addProductToCart(req.params.cid, req.params.pid);
        res.status(201).json({ cart });
    } catch (error) {
        console.error(`Error adding product ${req.params.pid} to cart ${req.params.cid}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un carrito por ID
// Eliminar un carrito específico por ID
router.delete('/:cid', async (req, res) => {
    try {
        const result = await CartManager.deleteCart(req.params.cid);
        if (!result) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.status(200).json({ message: `Cart ${req.params.cid} deleted successfully` });
    } catch (error) {
        console.error(`Error deleting cart ${req.params.cid}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;
