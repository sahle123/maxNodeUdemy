const fs = require('fs');
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const rootDir = require('../utils/path');
const logger = require('../utils/logger');
const B = require('../utils/basic');
const Cart = require('./cart');

// Get fully qualified path based on OS.
const _p = path.join(
  rootDir,
  'data',
  'products.json'
);

// Callback function to fetch all data in the 
// 'products.json' file.
const getAllProductsFromFile = cb => {

  fs.readFile(_p, (err, fileContent) => {
    if (err) {
      logger.logError(err);
    }
    else if (fileContent.length <= 0) {
      logger.log(`${_p} file is empty.`);
      return cb([]);
    }
    else {
      logger.plog(`Read file successfully: ${path.basename(_p)}`);
      return cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {

  // Product fields
  // id: UUID
  // title: string
  // imageUrl: string
  // desc: string
  // price: number
  // Note that new products will pass in NULL for the ID.
  // the ID will be created upon saving.
  constructor(id, title, imageUrl, desc, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.desc = desc;
    this.price = Number(price).toFixed(2);
  }

  // Saves a new product
  save() {
    getAllProductsFromFile((products) => {

      // Do update instead if the product already contains an ID.
      if(this.id) {
        this.update();
        return;
      } 
      else {
        this.id = uuidv4(); // Generate UUID for this new product.
        products.push(this);
  
        B.writeToFile(_p, products);
      }
    });
  }

  // Updates an existing product
  update() {
    getAllProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        B.writeToFile(_p, updatedProducts);
      }
      else {
        // Edited product does NOT exist.
        logger.logError("Could not update product. No ID was provided.");
      }
    });
  }

  // Deletes a product by its ID.
  static deleteById(id) {
    getAllProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      
      fs.writeFile(_p, JSON.stringify(updatedProducts), err => {
        if (err) {
          logger.logError(err);
        } else {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  // Data is returned via a callback.
  static fetchAll(cb) {
    getAllProductsFromFile(cb);
  }

  static getProductById(id, cb) {
    getAllProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }

}