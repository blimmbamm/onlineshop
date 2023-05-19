const database = require("../data/database");
const bcrypt = require("bcrypt");
const ShoppingCart = require("./shopping-carts");


class User {
  constructor(email, firstname, lastname, password) {
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password ? bcrypt.hashSync(password, 12) : null;
  }

  async passwordMatches(enteredPassword) {
    const user = await database
      .getDb()
      .collection("users")
      .findOne({ email: this.email });
    return bcrypt.compareSync(enteredPassword, user.password);
  }

  async exists() {
    const user = await database
      .getDb()
      .collection("users")
      .findOne({ email: this.email });

    return user ? true : false;
  }

  async save() {
    await database.getDb().collection("users").insertOne(this);
    return "successfully inserted user";
  }

  async getShoppingCart() {
    // find shopping cart in Db
    const user = await database
      .getDb()
      .collection("users")
      .findOne({ email: this.email });

    return new ShoppingCart(user.shoppingCart);
  }

  async updateShoppingCart(shoppingCart) {
    // maybe setShoppingCart() is better
    // console.log(shoppingCart);
    // this.shoppingCart = new ShoppingCart(shoppingCart);
  // console.log(this);
    // await database.getDb().collection("users").deleteOne({email: this.email});


    // what about $unset?
    await database
      .getDb()
      .collection("users")
      .updateOne({email: this.email}, {$set: {shoppingCart: shoppingCart}});
        
  }
}

module.exports = User;
