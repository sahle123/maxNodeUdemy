const mongoose = require('mongoose');
const logger = require('./logger');

const database = 'UDEMY_TEST_2';
const mongoUri = `mongodb://localhost:27017/${database}`;


const mongooseConnect = callback => {
  mongoose
    .connect(mongoUri)
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