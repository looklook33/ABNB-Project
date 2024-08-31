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
    "review": "Walk-in’ after Midnight was a really great stay. The property was beautifully designed. The Layout of the Home was perfect and just the right number of bathrooms to have our own",
    "stars": 5
  },
  {
    userId: 1,
    spotId: 5,
    "review": "Absolutely gorgeous view and stay! We loved how spacious it was for 8 people",
    "stars": 5.0
  },
  {
    userId: 2,
    spotId: 1,
    "review": "This house is absolutely beautiful and with so much to offer. The view is stunning. Perfect location. Will definitely recommend to friends and want o return ourselves.",
    "stars": 5.0
  },
  {
    userId: 2,
    spotId: 3,
    "review": "We enjoyed this gorgeous unique spot on the lake. It is decorated beautifully and was extremely peaceful and clean. Can’t wait to visit again in the summer.",
    "stars": 5.0
  },
  {
    userId: 3,
    spotId: 3,
    "review": "Beautiful container home right on the lake! The home is close to everything and is such a great amenity in itself!! We will be back!",
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
    "review": "Amazing place it was a phenomenal time will definitely be booking again. Every question I had upon arrival was answered immediately you will not be disappointed!",
    "stars": 5
  },
  {
    userId: 1,
    spotId: 8,
    "review": "Amazing place - Boathouse had great view of sunrise and sunset. House is super nice. Thank you for having us.",
    "stars": 5
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
