const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');
const router = express.Router();

// /shop/ => GET
router.get('/', shopController.getIndex);

// /shop/products => GET
router.get('/products', shopController.getProducts);

// N.B. These dynamic routes should go last. Routing is decided from
// top to bottom; any first match will run and the rest are ignored.
// /shop/products/<UUID> => GET 
router.get('/products/:productId', shopController.getProductById);

// /shop/cart => GET
router.get('/cart', isAuth, shopController.getCart);

// /shop/orders => GET
router.get('/orders', isAuth, shopController.getOrders);

// /shop/cart => POST
router.post('/cart', isAuth, shopController.postCart);

// /shop/cart-delete-item => POST
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem)

// /shop/orders => POST
router.post('/create-order', isAuth, shopController.postOrder);

// // /shop/checkout => GET
// router.get('/checkout', shopController.getCheckout);

module.exports = router;