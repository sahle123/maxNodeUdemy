const mongodb = require('mongodb');
const logger = require('./logger');

const MongoClient = mongodb.MongoClient;
const mongoUri = 'mongodb://localhost:27017/UDEMY_TEST';

// Database connection. Only used internally.
let _db;

const mongoConnect = callback => {
  MongoClient.connect(mongoUri)

  .then(client => {
    logger.plog("Successfully connected to Mongo!");
    _db = client.db();
    callback();
  })

  .catch(err => {
    logger.logError(err);
    throw err;
  });
};

const getDb = () => {
  if (_db)
    return _db;
  throw `There are issues with the database! Could not connect!`;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;