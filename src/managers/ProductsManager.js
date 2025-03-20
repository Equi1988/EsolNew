// managers/ProductsManager.js
const fs = require("fs").promises;
const path = require("path");

const productsPath = path.join(__dirname, "../data/products.json");

class ProductsManager {
    static async getProducts() {
        const data = await fs.readFile(productsPath, "utf-8");
        return JSON.parse(data);
    }

    static async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === parseInt(id));
    }

    static async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = { id: products.length + 1, ...product };
        products.push(newProduct);
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    static async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index === -1) throw new Error("Product not found");
        products[index] = { ...products[index], ...updatedFields };
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
        return products[index];
    }

    static async deleteProduct(id) {
        let products = await this.getProducts();
        products = products.filter(p => p.id !== parseInt(id));
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    }
}

module.exports = ProductsManager;



