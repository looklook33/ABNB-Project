'use strict';

/** @type {import('sequelize-cli').Migration} */

const {ReviewImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviewImages = [
  {
    reviewId: 1,
    url:'image1'
  },
  {
    reviewId: 2,
    url:'image2'
  },
  {
    reviewId: 3,
    url:'image3'
  },
  {
    reviewId: 4,
    url:'image4'
  },
]
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImages, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, reviewImages, {});

  }
};
