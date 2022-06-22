// User login model.
// DEV-NOTE: This does NOT have authentication yet.

const mongodb = require('mongodb');

const logger = require('../utils/logger');
const getDb = require('../utils/database').getDb;

// Document to access in MongoDB.
const DOCU = 'Users';

class User {
  
  // Schema
  // _id: mongodb.ObjectId()
  // username: string
  // email: string
  constructor(id, username, email) {
    this._id = new mongodb.ObjectId(id);
    this.username = username;
    this.email = email
  }

  // Saves
  save() {
    const db = getDb();
    
    return db
      .collection(DOCU)
      .insertOne(this)
      .then(result => {
        logger.plog("Made a new user in Mongo!");
        console.log(result);
      })
      .catch(err => { throw err; });
  }

  static findById(userId) {
    const db = getDb();

    return db
      .collection(DOCU)
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then(user => { return user; })
      .catch(err => { throw err; });
  }
}

module.exports = User;