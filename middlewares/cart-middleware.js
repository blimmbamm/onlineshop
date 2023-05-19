const ShoppingCart = require('../models/shopping-carts');

const setCartToSessionAndLocals = async (req, res, next) => {
    const shoppingCart = new ShoppingCart(req.session.shoppingCart);
    res.locals.shoppingCart = shoppingCart;
    req.session.shoppingCart = shoppingCart;
  
    next();
  };

module.exports = setCartToSessionAndLocals;