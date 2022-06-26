// Controller for anything related to the shop services.
const logger = require('../utils/logger');

const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
  Product
    .fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        hasProducts: products.length > 0
      });
    })
    .catch(err => logger.logError(err));;
};

exports.getProductById = (req, res, next) => {
  // N.B. .params is provided by Express.js.
  const prodId = req.params.productId;

  Product
    .getProductById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: 'Product details',
        product: product
      });
    })
    .catch(err => logger.logError(err));;
};

exports.getIndex = (req, res, next) => {
  Product
    .fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Index',
        hasProducts: products.length > 0
      });
    })
    .catch(err => logger.logError(err));;
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        products: products
      });
    })
    .catch(err => logger.logError(err));
};

exports.postCart = (req, res, next) => {
  // DEV-NOTE: productId name must match name in html form.
  const prodId = req.body.productId;
  Product.getProductById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      logger.plog("Added product to cart!");
      //console.log(result);
      res.redirect('/shop/cart');
    })
    .catch(err => logger.logError(err));
  //res.redirect('/shop/cart');
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .deleteItemFromCart(prodId)
    .then(result => { res.redirect('/shop/cart'); })
    .catch(err => console.log(err));
};

// DEV-NOTE: incomplete
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        orders: orders
      }); 
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(result => { res.redirect('/shop/orders') })
    .catch(err => console.log(err));
};