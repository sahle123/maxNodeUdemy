// Controller for anything related to admin services.
const mongodb = require('mongodb');

const logger = require('../utils/logger');

const errorController = require('./error');

const B = require('../utils/basic');
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: "Admin - Add Product",
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const desc = req.body.desc;
  const price = req.body.price;

  const product = new Product(title, imageUrl, desc, price, null);
  product
    .save()
    .then(result => { res.redirect('/admin/products'); })
    .catch(err => logger.logError(err));
};

exports.getProducts = (req, res, next) => {
  Product
    .fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin - Products',
        hasProducts: products.length > 0
      });
    })
    .catch(err => logger.logError(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    req.params.errorMsg = "Edit mode not set";
    return errorController.get400(req, res, next);
  }

  const prodId = req.params.productId;
  Product
    .getProductById(prodId)
    .then(product => {
      if (!product) {
        req.params.errorMsg = "Could not find product";
        return errorController.get400(req, res, next);
      }
      else {
        res.render('admin/edit-product', {
          pageTitle: 'Admin - Edit a product',
          editing: editMode,
          product: product
        });
      }
    })
    .catch(err => logger.logError(err));
};

exports.postEditProduct = (req, res, next) => {
  const updatedProduct = new Product(
    req.body.title,
    req.body.imageUrl,
    req.body.desc,
    req.body.price,
    req.body.productId);

  updatedProduct
    .update()
    .then(result => { res.redirect('/admin/products'); })
    .catch(err => logger.logError(err));
};

exports.postDeleteProduct = (req, res, next) => {

  // Error checking
  if (!req.body.productId) {
    red.params.errorMsg = "The product does NOT have an ID";
    return errorController.get400(req, res, next);
  }
  else {
    const prodId = req.body.productId;
    Product
      .deleteProductById(prodId)
      .then(result => { res.redirect('/admin/products'); })
      .catch(err => { throw err; });
  }
};