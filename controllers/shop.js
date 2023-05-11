/*
* Controller for anything related to shop services.
*/
const logger = require('../utils/logger');
const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        isAuthenticated: req.session.isLoggedIn,
        hasProducts: products.length > 0
      });
    })
    .catch(err => logger.logError(err));
};

exports.getProductById = (req, res, next) => {
  // N.B. .params is provided by Express.js.
  const prodId = req.params.productId;

  Product
    .findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: 'Product details',
        isAuthenticated: req.session.isLoggedIn,
        product: product
      });
    })
    .catch(err => logger.logError(err));;
};

exports.getIndex = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Index',
        isAuthenticated: req.session.isLoggedIn,
        hasProducts: products.length > 0
      });
    })
    .catch(err => logger.logError(err));;
};

exports.getCart = async (req, res, next) => {
  await req.session.user
    .populate('cart.items.productId')
    .then(user => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        isAuthenticated: req.session.isLoggedIn,
        products: user.cart.items
      });
    })
    .catch(err => logger.logError(err));
};

exports.getOrders = (req, res, next) => {
  Order
    .find({"user.userId": req.session.user._id})
    .then(orders => {
       res.render('shop/orders', {
        pageTitle: 'Orders',
        isAuthenticated: req.session.isLoggedIn,
        orders: orders
       });
    })
    .catch(err => logger.logError(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;

  req.session.user
    .removeFromCart(prodId)
    .then(result => { res.redirect('/shop/cart'); })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  // DEV-NOTE: productId name must match name in html form.
  const prodId = req.body.productId;
  Product
    .findById(prodId)
    .then(product => {
      return req.session.user.addToCart(product);
    })
    .then(result => {
      logger.plog("Added product to cart!");
      res.redirect('/shop/cart');
    })
    .catch(err => logger.logError(err));
};

exports.postOrder = async (req, res, next) => {
  await req.session.user
    .populate('cart.items.productId')
    .then(user => {
      const userProducts = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }
      });
      const order = new Order({
        user: {
          username: req.session.user.username,
          userId: req.session.user._id
        },
        products: userProducts
      });
      return order.save();
    })
    .then(() => { return req.session.user.clearCart(); })
    .then(() => { res.redirect('/shop/orders') })
    .catch(err => console.log(err));
};