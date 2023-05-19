
const database = require("../data/database");

class Category {
  constructor() {}
  
  static async getAllCategories() {
    
    const categories = await database
      .getDb()
      .collection("categories")
      .find()
      .toArray();
    return categories;
  }


}

module.exports = Category;
