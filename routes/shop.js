const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

// /shop/ => GET
router.get('/', shopController.getIndex);

// /shop/products => GET
router.get('/products', shopController.getProducts);

// /shop/orders => GET
router.get('/orders', shopController.getOrders);

// /shop/cart => GET
router.get('/cart', shopController.getCart);

// /shop/checkout => GET
router.get('/checkout', shopController.getCheckout);

module.exports = router;