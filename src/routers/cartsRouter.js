// const Router = require('express').Router;
// const CartManager = require("../managers/CartManager");
// const router = Router();

// // Obtener todos los carritos
// router.get('/', async (req, res) => {
//     try {
//         const carts = await CartManager.getCarts();
//         res.status(200).json(carts);
//     } catch (error) {
//         console.error("Error retrieving carts:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// // Crear un nuevo carrito
// // POST /api/carts
// router.post("/", async (req, res) => {
//     const cart = await CartManager.createCart();
//     res.status(201).json(cart);
// });


// // Obtener un carrito específico por ID
// router.get('/:cid', async (req, res) => {
//     try {
//         const cart = await CartManager.getCartById(req.params.cid);
//         if (!cart) return res.status(404).json({ error: "Cart not found" });
//         res.status(200).json(cart);
//     } catch (error) {
//         console.error(`Error retrieving cart ${req.params.cid}:`, error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// // Agregar un producto a un carrito específico
// // router.post('/:cid/product/:pid', async (req, res) => {
// //     try {
// //         const cart = await CartManager.addProductToCart(req.params.cid, req.params.pid);
// //         res.status(201).json({ cart });
// //     } catch (error) {
// //         console.error(`Error adding product ${req.params.pid} to cart ${req.params.cid}:`, error);
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// router.post('/:cid/producto/:pid', async (req, res) => {
//     try {
//         const { cid, pid } = req.params;
        
//         // Verificamos si el carrito existe
//         const cart = await Cart.findById(cid);
//         if (!cart) {
//             return res.status(404).json({ message: 'Carrito no encontrado' });
//         }
        
//         // Lógica para agregar el producto al carrito
//         // Ejemplo: si tienes un array de productos en el carrito, puedes agregarlo así
//         cart.products.push(pid);
        
//         await cart.save(); // Guardamos el carrito con el nuevo producto
//         return res.status(200).json({ message: 'Producto agregado al carrito', cart });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Error al agregar el producto al carrito' });
//     }
// });


// // Eliminar un carrito por ID
// // Eliminar un carrito específico por ID
// router.delete('/:cid', async (req, res) => {
//     try {
//         const result = await CartManager.deleteCart(req.params.cid);
//         if (!result) {
//             return res.status(404).json({ error: "Cart not found" });
//         }
//         res.status(200).json({ message: `Cart ${req.params.cid} deleted successfully` });
//     } catch (error) {
//         console.error(`Error deleting cart ${req.params.cid}:`, error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });



// module.exports = router;

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
router.post("/", async (req, res) => {
    try {
        const cart = await CartManager.createCart();
        res.status(201).json(cart);
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
router.post('/:cid/producto/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Verificamos si el carrito existe
        let cart = await CartManager.getCartById(cid);
        if (!cart) {
            // Si el carrito no existe, lo creamos
            cart = await CartManager.createCart();
        }

        // Agregar producto al carrito
        const updatedCart = await CartManager.addProductToCart(cid, pid);

        // Devolvemos el carrito actualizado
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un carrito por ID
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
