// Packages
const express = require('express');

// Controllers
const adminController = require('../controllers/admin');

// Middleware + setup
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// /admin/ => GET
router.get('/', (req, res, next) => {
  res.redirect(req.baseUrl + "/add-product");
});

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/edit-product/<productId> => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', isAuth, adminController.postEditProduct);

// /admin/delete-product => POST
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;