const ShoppingCart = require("../models/shopping-carts");
const User = require("../models/users");

const getShoppingCart = (req, res) => {
  res.render("shopping-cart", { shoppingCart: req.session.shoppingCart });
};

const addProduct = async (req, res, next) => {
  const shoppingCart = new ShoppingCart(req.session.shoppingCart);

  await shoppingCart.addProduct(req.body.productId, 1);

  req.session.shoppingCart = shoppingCart;
  if (req.session.isAuthenticated) {
    const user = new User(req.session.email);
    await user.updateShoppingCart(shoppingCart);
  }
  res.json({
    numberOfItems: req.session.shoppingCart.totalNumberOfItems,
    csrfToken: res.locals.csrfToken,
  });
};

const changeProductQuantity = async (req, res) => {
  const shoppingCart = new ShoppingCart(req.session.shoppingCart);
  shoppingCart.setQuantity(req.body.cartItemPosition, +req.body.quantity);
  req.session.shoppingCart = shoppingCart;

  if (req.session.isAuthenticated) {
    const user = new User(req.session.email);
    await user.updateShoppingCart(shoppingCart);
  }

  res.json({ shoppingCart: shoppingCart, csrfToken: res.locals.csrfToken });
};

const removeProduct = async (req, res) => {
  let shoppingCart = new ShoppingCart(req.session.shoppingCart);
  shoppingCart.removeProduct(req.body.cartItemPosition);

  req.session.shoppingCart = shoppingCart;
  req.session.save(); // necessary?

  if (req.session.isAuthenticated) {
    // in this case, also add cart to user database
    const user = new User(req.session.email);
    await user.updateShoppingCart(shoppingCart);
  }

  res.json({ shoppingCart: shoppingCart, csrfToken: res.locals.csrfToken });
};

const placeOrder = (req, res) => {
  console.log("Save order in db and clear cart logic here...");
  // delete cart in session and in user db document
  const user = new User(req.session.email);
  user.updateShoppingCart(new ShoppingCart());
  req.session.shoppingCart = null;

  req.session.successMessage = `Your order has been submitted successfully. <br>
    Nothing is going to happen though since this
      is just a dummy online shop, haha!`;

  res.redirect("success");
};

module.exports = {
  getShoppingCart: getShoppingCart,
  addProduct: addProduct,
  removeProduct: removeProduct,
  changeProductQuantity: changeProductQuantity,
  placeOrder: placeOrder,
};
