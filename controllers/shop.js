// Controller for anything related to the shop services.

const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // Uses the set templating engine (i.e. the 'view engine') and return that template.
    // Since we set the 'view' global variable in express, we do not need to provide
    // the full path to the .pug or .ejs file.
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      hasProducts: products.length > 0
    });
  });
};

exports.getProductById = (req, res, next) => {
  // N.B. .params is provided by Express.js.
  const prodId = req.params.productId;

  Product.getProductById(prodId, (product) => {
    res.render('shop/product-detail', {
      pageTitle: 'Product details',
      product: product
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Index',
      hasProducts: products.length > 0
    });
  });
};

exports.getCart = (req, res, next) => {
  // Get cart product IDs and all products and returned
  // a matched list of product details.
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];

      if (cart && products) {
        for (prod of products) {        
          const cartProductData = cart.products.find(p => p.id === prod.id);
  
          if(cartProductData) {
            cartProducts.push({
              productData: prod,
              qty: cartProductData.qty
            });
          }
        }

      }

      res.render('shop/cart', {
        pageTitle: 'Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  // DEV-NOTE: productId name must match name in html form.
  const prodId = req.body.productId;
  Product.getProductById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/shop/cart');
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  
  Product.getProductById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/shop/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders'
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout'
  });
};