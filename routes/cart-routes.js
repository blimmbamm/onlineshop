const express = require("express");
const controllers = require('../controllers/cart-controllers');

const router = express.Router();

router.post("/add-product", controllers.addProduct);

router.post("/changequantity", controllers.changeProductQuantity);

router.get("/shopping-cart", controllers.getShoppingCart);

router.post("/remove-product", controllers.removeProduct);

router.post("/place-order", controllers.placeOrder);

module.exports = router;
