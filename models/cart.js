const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');
const logger = require('../utils/logger');
const B = require('../utils/basic');

const _p = path.join(
  rootDir,
  'data',
  'cart.json'
);

module.exports = class Cart {

  // Product's ID, product's price.
  static addProduct(id, productPrice) {
    // Fetch the previous cart from file.
    fs.readFile(_p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0.0 };

      // Cart doesn't exist
      if (err) {
        logger.logError('Cart does not exist!');
      }
      else if (fileContent.length > 0) {
        cart = JSON.parse(fileContent);
      }

      // See if we already have this product
      // Add new product or increase qty.
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        //cart.products = [...cart.products]; // DEV-NOTE: Is this step even needed?????????
        cart.products[existingProductIndex] = updatedProduct;
      }
      else {
        updatedProduct = { id: id, qty: 1};
        // Add updatedProduct to the cart.
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = Number(cart.totalPrice) + Number(productPrice);
      cart.totalPrice = cart.totalPrice.toFixed(2);
      B.writeToFile(_p, cart);
    });
  }

  // Deletes all instances of a certain product via its ID.
  static deleteProduct(id, productPrice) {
    // Fetch all products in our cart.json file.
    fs.readFile(_p, (err, fileContent) => {
      // Log error and return early if there is an error.
      if(err)
        logger.logError(`encountered an error: ${err}`);

      else if (fileContent.lenth <= 0)
        logger.logError(`fileContent is empty for ${id}`); 
        
      else {
        const updatedCart = { ...JSON.parse(fileContent) };
        const product = updatedCart.products.find(prod => prod.id === id);

        // Cases where a product we wish to delete isn't in a cart.
        if (!product) 
          return;

        updatedCart.products = updatedCart.products.filter(prod => prod.id !== id); 
        updatedCart.totalPrice = updatedCart.totalPrice - (productPrice*product.qty);

        B.writeToFile(_p, updatedCart);
      }
    });
  }

  // Returns current cart product IDs.
  static getCart(cb) {
    fs.readFile(_p, (err, fileContent) => {

      if (err) {
        logger.logError(err);
        cb(null);
      } 
      else if (fileContent.length <= 0) {
        logger.logError(`File is empty for ${_p}`);
        cb(null);
      } 
      else {
        const cart = JSON.parse(fileContent);
        cb(cart);
      }

    });
  }
}