const Product = require("../models/products");

const getHome = async (req, res, next) => {
  let mostViewedProducts;
  try {
    mostViewedProducts = await Product.fetchMostViewedProducts(3);
  } catch (error) {
    return next(error);
  }

  res.render("index", { mostViewedProducts: mostViewedProducts });
};

const getAllProducts = async (req, res, next) => {
  const productsPerPage = 5;
  let page = req.query.page;
  if (!page) {
    page = 1;
  }

  let categories, products;
  try {
    categories = await Product.fetchAllCategories();
    products = await Product.fetchAllProducts();
  } catch (error) {
    return next(error);
  }

  const numberOfProducts = products.length;

  const numberOfPages = Math.floor(products.length / productsPerPage) + 1;

  products = products.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  res.render("products", {
    categories: categories,
    products: products,
    numberOfProducts: numberOfProducts,
    numberOfPages: numberOfPages,
    page: page,
  });
};

const getCategoryProducts = async (req, res, next) => {
  let categories, products;
  try {
    categories = await Product.fetchAllCategories();
    products = await Product.fetchCategoryProducts(req.params.category);    
  } catch (error) {
    return next(error);
  }
  res.render("products-category", {
    categories: categories,
    products: products,
  });
};

const getSingleProduct = async (req, res, next) => {
  let product;
  try {
    product = await Product.fetchProduct(req.params.productId);
    // Increase number of times viewed:
    product.numberOfTimesViewed++;

    await Product.updateProduct(req.params.productId, {
      $inc: { numberOfTimesViewed: 1 },
    });    
  } catch (error) {
    return next(error);
  }

  res.render("product-detail", { product: product });
};

module.exports = {
  getHome: getHome,
  getAllProducts: getAllProducts,
  getCategoryProducts: getCategoryProducts,
  getSingleProduct: getSingleProduct,
};
