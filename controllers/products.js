
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: "Add Product"
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();

  res.redirect('/shop');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // Uses the set templating engine (i.e. the 'view engine') and return that template.
    // Since we set the 'view' global variable in express, we do not need to provide
    // the full path to the .pug or .ejs file.
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Max\'s Shop',
      hasProducts: products.length > 0
    });
  });
}