'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Review} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviews = [
  {
    spotId: 1,
    userId: 1,
    review:"This was an awesome spot!",
    stars:5
  },
  {
    spotId: 2,
    userId: 2,
    review:"This was a very unique experience.",
    stars:5
  },
  {
    spotId: 3,
    userId: 3,
    review:"Great experience and location for a scenic getaway!",
    stars:4
  },
  {
    userId: 4,
    spotId: 1,
    "review": "Great hideaway, super place to decompress and take in the nature.",
    "stars": 5.0
  },
 
] 

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate(reviews,{validate:true})

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, reviews ,{},
  )}
};
