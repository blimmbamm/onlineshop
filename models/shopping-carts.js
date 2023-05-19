const Product = require("../models/products");

class ShoppingCart {
  constructor(shoppingCart) {
    if (!shoppingCart) {
      this.cartItems = [];
      this.totalPrice = 0;
      this.totalNumberOfItems = 0;
    } else {
      this.cartItems = shoppingCart.cartItems.map(
        (cartItem) => new ShoppingCartItem(cartItem.product, cartItem.quantity)
      );
      this.totalPrice = shoppingCart.totalPrice;
      this.totalNumberOfItems = shoppingCart.totalNumberOfItems;
    }
  }

  getCartItem(productId) {
    return this.cartItems.find((cartItem) => cartItem.product.id == productId);
  }

  cartItemExists(productId) {
    return this.cartItems.some((cartItem) => cartItem.product.id == productId);
  }

  async addProduct(productId, quantity) {
    if (this.cartItemExists(productId)) {
      this.getCartItem(productId).setQuantity(null, quantity);
    } else {
      const product = await Product.fetchProduct(productId);
      this.cartItems.push(new ShoppingCartItem(product, quantity));
    }

    this.calculateTotalPrice();
    this.calculateNumberOfItems();

    return;
  }

  removeProduct(cartItemPosition) {
    this.cartItems.splice(cartItemPosition, 1);
    this.calculateTotalPrice();
    this.calculateNumberOfItems();
  }

  calculateTotalPrice() {
    this.totalPrice = 0;
    this.cartItems.forEach((cartItem) => {
      this.totalPrice += +cartItem.totalPrice;
    });
    this.totalPrice = (Math.round(+this.totalPrice * 100) / 100).toFixed(2);
  }

  calculateNumberOfItems() {
    this.totalNumberOfItems = 0;
    this.cartItems.forEach((cartItem) => {
      this.totalNumberOfItems += cartItem.quantity;
    });
    return;
  }

  setQuantity(cartItemPosition, quantity) {
    this.cartItems[cartItemPosition].setQuantity(quantity);
    this.calculateTotalPrice();
    this.calculateNumberOfItems();
  }

  async mergeShoppingCarts(shoppingCart) {
    for (const cartItem of shoppingCart.cartItems) {
      await this.addProduct(cartItem.product.id, cartItem.quantity);
    }
  }
}

class ShoppingCartItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = +this.product.price * this.quantity;
    this.totalPrice = (Math.round(+this.totalPrice * 100) / 100).toFixed(2);
  }

  setQuantity(newQuantity, increment) {
    if (newQuantity) {
      this.quantity = newQuantity;
    } else if (increment) {
      this.quantity += increment;
    }
    this.calculateTotalPrice();
    return;
  }
}

module.exports = ShoppingCart;
