const mongodb = require('mongodb');

const logger = require('../utils/logger');
const getDb = require('../utils/database').getDb;

class Product {
  // Product fields
  // title: string
  // imageUrl: string
  // desc: string
  // price: number
  // _id: string (optional)
  constructor(title, imageUrl, desc, price, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.desc = desc;
    this.price = Number(price);
    this._id = new mongodb.ObjectId(id);
  }

  // Save Product object to MongoDB.
  save() {
    const db = getDb();
    return db
      .collection('dummy')
      .insertOne(this)
      .then(result => {
        logger.plog("Successfully wrote to Mongo");
        console.log(result);
      })
      .catch(err => {
        logger.logError(err);
        throw err;
      });
  }

  // Updates Product object that exists in MongoDB.
  update() {
    if (this._id) {
      const db = getDb();
      return db
        .collection('dummy')
        .updateOne({ _id: this._id }, { $set: this })
        .then(result => {
          logger.plog(`Successfully updated ${this._id} in Mongo`);
          console.log(result);
        })
        .catch(err => {
          logger.logError(err);
          throw err;
        });
    }
    else {
      logger.logError("There is no ID. Could not update product details");
    }
  }

  // Fetches all products
  static fetchAll() {
    const db = getDb();

    // N.B. the .find() method does NOT return a promise, but rather a cursor.
    // A cursor is a subset of all the data returned. This is important
    // when working with larger data sets since loading the whole collection
    // into memory may not be physically possible. 
    // Converting to an array will give all the whole data set. Only do this 
    // if you KNOW that the returned collection is fairly small (i.e. ~100 docs).
    return db.collection('dummy')
      .find()
      .toArray()
      .then(products => { return products; })
      .catch(err => { throw err; });
  }

  // Fetches a single product via its productId.
  static getProductById(productId) {
    const db = getDb();

    return db
      .collection('dummy')
      .findOne({ _id: new mongodb.ObjectId(productId) })
      //.next()
      .then(product => { return product; })
      .catch(err => { throw err; });
  }

  // Deletes a single prooduct via its ID.
  static deleteProductById(productId) {
    const db = getDb();

    return db
      .collection('dummy')
      .deleteOne({ _id: new mongodb.ObjectId(productId) })
      .then (result => { return result; })
      .catch(err => { throw err; });
  }
}

module.exports = Product;