const mongoose = require('mongoose');
const logger = require('./logger');

const database = 'UDEMY_TEST_2';
const mongoUri = `mongodb://localhost:27017/${database}`;

// Database connection. Only used internally.
//let _db;

const mongooseConnect = callback => {
  mongoose.connect(mongoUri)

  .then(result => {
    logger.plog("Successfully connected to Mongo!");
    //_db = client.db();
    callback();
  })

  .catch(err => {
    logger.logError(err);
    throw err;
  });
};

// const getDb = () => {
//   if (_db)
//     return _db;
//   throw `There are issues with the database! Could not connect!`;
// };

exports.mongooseConnect = mongooseConnect;
//exports.getDb = getDb;