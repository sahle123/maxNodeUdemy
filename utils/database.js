const mongoose = require('mongoose');
const logger = require('./logger');

//
// Constants
const DATABASE = 'UDEMY_TEST_2';
const MONGODB_URI = `mongodb://localhost:27017/${DATABASE}`;


const mongooseConnect = callback => {
  mongoose
    .connect(MONGODB_URI)
    .then(result => {
      logger.plog("Successfully connected to Mongo!");
      callback();
    })
    .catch(err => {
      logger.logError(err);
      throw err;
    });
};

exports.mongooseConnect = mongooseConnect;
exports.MONGODB_URI = MONGODB_URI;