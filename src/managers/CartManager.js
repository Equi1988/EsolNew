const fs = require("fs");
const ProductsManager = require("../managers/ProductsManager");

class CartManager {
    static path = "./src/data/carts.json";

    static async createCart() {
        let carts = await this.getCarts();
        let cart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }

    static async getCarts() {
        if (fs.existsSync(this.path)) {
            const fileData = await fs.promises.readFile(this.path, "utf-8");
            return fileData.trim().length ? JSON.parse(fileData) : [];
        } else {
            return [];
        }
    }

    static async getCartById(cid) {
        let carts = await this.getCarts();
        return carts.find(cart => cart.id === parseInt(cid));
    }

    static async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        let cart = carts.find((cart) => cart.id === parseInt(cartId));

        // Si no existe el carrito, se crea uno nuevo
        if (!cart) {
            console.log(`Cart ${cartId} not found. Creating a new one.`);
            cart = { id: parseInt(cartId), products: [] };
            carts.push(cart);
        }

        // Obtener el producto del archivo products.json
        const product = await ProductsManager.getProductById(productId);
        console.log("Product retrieved for cart:", product);

        // Manejar errores si el producto no existe o el stock es insuficiente
        if (!product) throw new Error("Product not found");
        if (product.stock <= 0) throw new Error("Product is out of stock");

        // Reducir el stock del producto antes de agregarlo al carrito
        const updatedProduct = { ...product, stock: product.stock - 1 };
        console.log(`Stock after reduction: ${updatedProduct.stock}`);

        // Guardar los cambios del producto actualizado
        await ProductsManager.updateProduct(productId, { stock: updatedProduct.stock });

        // Agregar o actualizar el producto en el carrito
        const cartProduct = cart.products.find((p) => p.id === productId);
        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            cart.products.push({
                id: productId,
                title: product.title,
                price: product.price,
                stock: product.stock,
                quantity: 1,
            });
        }

        // Guardar los cambios en el carrito
        await this.saveCarts(carts);
        console.log(`Product ${productId} added to cart ${cartId}`);
        return cart;
    }

    // Método para guardar los carritos en el archivo
    static async saveCarts(carts) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            console.log("Carts saved successfully!");
        } catch (error) {
            console.error("Error saving carts:", error);
            throw new Error("Unable to save carts");
        }
    }
}

module.exports = CartManager;





