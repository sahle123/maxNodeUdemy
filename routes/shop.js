const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

// /shop/ => GET
router.get('/', shopController.getIndex);

// /shop/products => GET
router.get('/products', shopController.getProducts);

// N.B. These dynamic routes should go last. Routing is decided from
// top to bottom; any first match will run and the rest are ignored.
// /shop/products/<UUID> => GET 
router.get('/products/:productId', shopController.getProductById);

// /shop/orders => GET
router.get('/orders', shopController.getOrders);

// /shop/cart => GET
router.get('/cart', shopController.getCart);

// /shop/checkout => GET
router.get('/checkout', shopController.getCheckout);

module.exports = router;