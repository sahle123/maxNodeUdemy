const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/ => GET
router.get('/', (req, res, next) => {
  res.redirect(req.baseUrl + "/add-product");
});

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/edit-product => GET
router.get('/edit-product', adminController.getEditProduct);

module.exports = router;