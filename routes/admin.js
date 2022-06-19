const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

// /admin/ => GET
router.get('/', (req, res, next) => {
  res.redirect(req.baseUrl + "/add-product");
});

// /admin/add-product => GET
router.get("/add-product", productsController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", productsController.postAddProduct);

// /admin/products => GET
router.get('/products');

module.exports = router;