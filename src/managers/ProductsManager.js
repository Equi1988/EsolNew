const fs = require("fs");

class ProductsManager {
    static path = "./src/data/products.json";

    // Obtener todos los productos
    static async getProducts() {
        console.log("Leyendo productos desde el archivo");
        if (fs.existsSync(this.path)) {
            const fileData = await fs.promises.readFile(this.path, "utf-8");
            if (fileData.trim().length === 0) {
                await fs.promises.writeFile(this.path, "[]", "utf-8");
                return [];
            } else {
                return JSON.parse(fileData);
            }
        } else {
            return [];
        }
    }

    // Obtener producto por ID
    static async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find((p) => p.id === parseInt(id));
        console.log(`Buscando producto por ID (${id}):`, product); // Depuración
        return product;
    }

    // Agregar producto
    static async addProduct(product) {
        console.log("Agregando producto:", product);
        let products = await this.getProducts();
        product.id = products.length ? products[products.length - 1].id + 1 : 1;
        console.log("ID asignado:", product.id);
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return product;
    }

    // Actualizar producto
    static async updateProduct(pid, productData) {
        let products = await this.getProducts();
        let index = products.findIndex((product) => product.id === parseInt(pid));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log(`Producto ${pid} actualizado con datos:`, productData);
            return products[index];
        } else {
            console.error(`Error: Producto con ID ${pid} no encontrado`);
            throw new Error("Producto no encontrado");
        }
    }

    // Eliminar producto
    static async deleteProduct(pid) {
        console.log(`Eliminando producto con ID: ${pid}`);
        let products = await this.getProducts();
        products = products.filter((product) => product.id !== parseInt(pid));
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    // Agregar producto al carrito
    static async addProductToCart(cartId, productId) {
        console.log(`Agregando producto ${productId} al carrito ${cartId}`);
        const carts = await this.getCarts(); // Implementar lógica para obtener carritos
        let cart = carts.find((cart) => cart.id === parseInt(cartId));

        if (!cart) {
            console.log(`Carrito ${cartId} no encontrado. Creando uno nuevo.`);
            cart = { id: parseInt(cartId), products: [] };
            carts.push(cart);
        }

        const product = await this.getProductById(productId);
        if (!product) throw new Error("Producto no encontrado");
        if (product.stock <= 0) throw new Error("Producto sin stock");

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

        product.stock -= 1;
        await this.updateProduct(productId, { stock: product.stock });

        await this.saveCarts(carts); // Implementar lógica para guardar carritos
        console.log(`Producto ${productId} agregado al carrito ${cartId}`);
        return cart;
    }
}

module.exports = ProductsManager;



