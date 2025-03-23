// routers/viewsRouter.js
const express = require("express");
const ProductsManager = require("../managers/productsManager");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});

router.get("/products", async (req, res) => {
    const products = await ProductsManager.getProducts();
    res.render("products", { products });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

module.exports = router;
