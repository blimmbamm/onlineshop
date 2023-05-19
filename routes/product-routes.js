const express = require("express");
const controllers = require('../controllers/product-controllers');

const router = express.Router();

router.get("/", controllers.getHome);

router.get("/products", controllers.getAllProducts);

router.get("/products/:category", controllers.getCategoryProducts);

router.get("/product/:productId", controllers.getSingleProduct);

module.exports = router;
