const fs = require('fs');
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const rootDir = require('../utils/path');
const logger = require('../utils/logger');

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
      logger.plog("Read file successfully");
      return cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {

  constructor(title, imageUrl, desc, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.desc = desc;
    this.price = price;
  }

  save() {
    this.id = uuidv4(); // Generate UUID for this new product.
    
    getAllProductsFromFile((products) => {
      products.push(this);

      fs.writeFile(_p, JSON.stringify(products), (err) => {
        if (err) logger.logError(err);
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