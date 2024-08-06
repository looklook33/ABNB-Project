'use strict';

/** @type {import('sequelize-cli').Migration} */

const {SpotImage} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotImages = [
  {
    spotId:1,
    url:'spotImage1',
    preview:true
  },
  {
    spotId:2,
    url:'spotImage2',
    preview:true
  },
  {
    spotId:3,
    url:'spotImage3',
    preview:true
  },
  {
    spotId: 4,
    url: 'spotImage4',
    preview: true
  },
]
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImages, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});

  }
};
