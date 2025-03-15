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

    static async addProductToCart(cid, pid) {
        let carts = await this.getCarts();
        let cart = carts.find(cart => cart.id === parseInt(cid));
    
        // Crear el carrito automáticamente si no existe
        if (!cart) {
            console.log(`Cart with ID ${cid} not found. Creating a new cart.`);
            cart = { id: parseInt(cid), products: [] };
            carts.push(cart);
        }
    
        // Verificar si el producto existe en la base de datos
        let product = await ProductsManager.getProductById(parseInt(pid));
        if (!product) throw new Error("Product not found in database");
    
        if (product.stock <= 0) throw new Error("Product is out of stock");
    
        // Agregar o actualizar el producto en el carrito
        let cartProduct = cart.products.find(p => p.id === parseInt(pid));
        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            cart.products.push({
                id: parseInt(pid),
                title: product.title,
                description: product.description,
                price: product.price,
                category: product.category,
                quantity: 1
            });
        }
    
        // Reducir el stock del producto en la base de datos
        product.stock -= 1;
        await ProductsManager.updateProduct(pid, { stock: product.stock });
    
        // Guardar los cambios en el archivo carts.json
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        console.log(`Product ID: ${pid} added to cart ID: ${cid}`);
        return cart;
    }
    
}

module.exports = CartManager;



