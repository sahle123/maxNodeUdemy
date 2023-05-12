/*
* Controller for anything related to admin services.
*/

const logger = require('../utils/logger');

const errorController = require('./error');

//const B = require('../utils/basic');
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: "Admin - Add Product",
    isAuthenticated: req.session.isLoggedIn,
    editing: false
  });
};

exports.getProducts = (req, res, next) => {
  Product
    .find()
    // .select('tittle price -desc -_id')
    // .populate('userId', 'email')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin - Products',
        isAuthenticated: req.session.isLoggedIn,
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
    .findById(prodId)
    .then(product => {
      if (!product) {
        req.params.errorMsg = "Could not find product";
        return errorController.get400(req, res, next);
      }
      else {
        res.render('admin/edit-product', {
          pageTitle: 'Admin - Edit a product',
          editing: editMode,
          isAuthenticated: req.session.isLoggedIn,
          product: product
        });
      }
    })
    .catch(err => logger.logError(err));
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const desc = req.body.desc;
  const price = req.body.price;
  const userId = req.user._id;

  const product = new Product({
    title: title,
    price: price,
    desc: desc,
    imageUrl: imageUrl,
    userId: userId
  });
  
  product
    .save()
    .then(result => { res.redirect('/admin/products'); })
    .catch(err => logger.logError(err));
};

exports.postEditProduct = (req, res, next) => {

  Product
    .findById(req.body.productId)
    .then(product => {
      product.title = req.body.title;
      product.imageUrl = req.body.imageUrl;
      product.desc = req.body.desc;
      product.price = req.body.price;
      product.userId = req.user._id;
      product.save();
    })
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
      .findByIdAndRemove(prodId)
      .then(result => { res.redirect('/admin/products'); })
      .catch(err => { 
        logger.logError(err);
        throw err; 
      });
  }
};