'use strict';

/** @type {import('sequelize-cli').Migration} */
const {Spot} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spots = [
  {
    ownerId: 1,
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 123,
  },
  {
    ownerId: 2,
    address: "456 Disney Lane",
    city: "Houston",
    state: "Texas",
    country: "United States of America",
    lat: 33.7645358,
    lng: -34.4730327,
    name: "Bpp Academy",
    description: "Place where web developers are created",
    price: 123,
  },
  {
    ownerId: 3,
    address: "789 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 35.7645358,
    lng: -36.4730327,
    name: "Cpp Academy",
    description: "Place where web developers are created",
    price: 123,
  },
]
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate(spots,{validate:true});
  },

  async down (queryInterface, Sequelize) {
    // options.tableName = 'spots';
    // const Op= Sequelize.Op;'
   // return queryInterface.bulkDelete(options,{})
   await queryInterface.bulkDelete('Spots',{},{})

  }
};
