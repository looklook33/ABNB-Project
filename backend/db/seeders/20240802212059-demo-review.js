'use strict';

/** @type {import('sequelize-cli').Migration} */

const {Review} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviews = [
  {
    userId: 1,
    spotId: 4,
    "review": " This is one of the most beautiful places on earth.",
    "stars": 5
  },
  {
    userId: 1,
    spotId: 5,
    "review": "We had an amazing experience. Special shout out to the crew, (Poncho, Isabel, and Maria) for making it a wonderful day for our family.",
    "stars": 5.0
  },
  {
    userId: 2,
    spotId: 1,
    "review": "I had a great time, super fun dive, lots of fish!",
    "stars": 5.0
  },
  {
    userId: 2,
    spotId: 3,
    "review": "Discover this shell-covered beach on Padre Island, where kids can have a lot of fun.",
    "stars": 5.0
  },
  {
    userId: 3,
    spotId: 3,
    "review": "Nice beach. Clean and safe. Saw lifeguards patrolling, was a red flag day but we were careful. Trach cans and porta-potties at each entrance. We had fun.",
    "stars": 5.0
  },
  {
    userId: 3,
    spotId: 3,
    "review": "Awesome spot. Great location, right on the water. Hosts were responsive. Close to a grocery store too!",
    "stars": 4.0
  },
  {
    userId: 3,
    spotId: 5,
    "review": "This is a beautiful home and property! Kaley is a great host and our stay was comfortable and relaxing. We would love to visit again.",
    "stars": 5
  },
  {
    userId: 1,
    spotId: 6,
    "review": "Very clean place, love the seclusion from other houses for privacy.",
    "stars": 5
  },
  {
    userId: 1,
    spotId: 7,
    "review": "Amazing place!",
    "stars": 5
  },
  // {
  //   userId: 1,
  //   spotId: 8,
  //   "review": "Amazing place.",
  //   "stars": 5
  // },
 
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
