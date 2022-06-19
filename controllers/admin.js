// Controller for anything related to admin services.

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: "Admin - Add Product"
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const desc = req.body.desc;
  const price = req.body.price;
  
  const product = new Product(title, imageUrl, desc, price);
  product.save();

  res.redirect('/shop');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin - Products',
      hasProducts: products.length > 0
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Admin - Edit a product'    
  });
};