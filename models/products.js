const db = require("../data/database");

const { ObjectId } = require("mongodb");

class Product {
  constructor(productData) {
    this.id = productData._id.toString();
    this.colorText = productData.colorText;
    this.categoryText = productData.categoryText;
    this.itemNumber = productData.itemNumber;
    this.category = productData.category;
    this.color = productData.color;
    this.nameText = productData.nameText;
    this.descriptionText = productData.descriptionText;
    this.price = productData.price;
    this.numberOfTimesViewed = productData.numberOfTimesViewed;
    this.imageFile = productData.imageFile;
  }

  static async fetchAllCategories() {
    const categories = await db
      .getDb()
      .collection("categories")
      .find()
      .toArray();
    return categories;
  }

  static async fetchAllBrands() {
    const brands = await db.getDb().collection("brands").find().toArray();
    return brands;
  }

  static async fetchAllProducts() {
    const products = await db.getDb().collection("products").find().toArray();
    return products.map((product) => new Product(product));
  }

  // products can be filterd by category, color, brand and price
  static async fetchCategoryProducts(category) {
    const products = await db
      .getDb()
      .collection("products")
      .find({ category: category })
      .toArray();
    return products.map((product) => new Product(product));
  }

  static async fetchMostViewedProducts(numberOfProducts) {
    const products = await db
      .getDb()
      .collection("products")
      .find()
      .sort({ numberOfTimesViewed: -1 })
      .limit(numberOfProducts)
      .toArray();
    return products.map((product) => new Product(product));
  }

  static async fetchProduct(productId) {
    let productObjectId;
    try {
      productObjectId = new ObjectId(productId);
    } catch (error) {
      error.code = 404;
      console.log(error);
      throw error;
    }

    let product;
    try {
      product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: productObjectId });
    } catch (error) {
      console.log(error);
      throw error;
    }
    
    return new Product(product);
    
  }

  static async updateProduct(productId, update) {
    const result = await db
      .getDb()
      .collection("products")
      .updateOne({ _id: new ObjectId(productId) }, update);
  }
}

module.exports = Product;
