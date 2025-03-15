
const fs = require("fs");

class ProductsManager {
    static path = "./src/data/products.json";

    static async getProducts() {
        console.log("Reading products from file");
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

    static async getProductById(pid) {
        console.log(`Getting product by ID: ${pid}`);
        let products = await this.getProducts();
        return products.find(product => product.id === parseInt(pid));
    }

    static async addProduct(product) {
        console.log("Adding product:", product);
        let products = await this.getProducts();
        product.id = products.length ? products[products.length - 1].id + 1 : 1;
        console.log("Assigned ID:", product.id);
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return product;
    }

    static async updateProduct(pid, productData) {
        console.log(`Updating product ID: ${pid}`, productData);
        let products = await this.getProducts();
        let index = products.findIndex(product => product.id === parseInt(pid));
        if (index !== -1) {
            products[index] = {...products[index], ...productData};
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[index];
        } else {
            throw new Error("Product not found");
        }
    }

    static async deleteProduct(pid) {
        console.log(`Deleting product ID: ${pid}`);
        let products = await this.getProducts();
        products = products.filter(product => product.id !== parseInt(pid));
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}

module.exports = ProductsManager;