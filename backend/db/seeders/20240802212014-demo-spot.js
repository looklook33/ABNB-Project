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
    price: 140,
  },
  {
    ownerId: 1,
    address: "456 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 40.7645358,
    lng: -120.4730327,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 140,
  },
  {
    ownerId: 1,
    address: "789 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 50.7645358,
    lng: -100.4730327,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 140,
  },
  {
    ownerId: 2,
    address: "123 Tracy St",
    city: "Houston",
    state: "Texas",
    country: "United States of America",
    lat: 33.7645358,
    lng: -34.4730327,
    name: "Bpp Academy",
    description: "Place where web developers are created",
    price: 200,
  },
  {
    ownerId: 2,
    address: "456 Tracy St",
    city: "Houston",
    state: "Texas",
    country: "United States of America",
    lat: 21.7645358,
    lng: -39.4730327,
    name: "Bpp Academy",
    description: "Place where web developers are created",
    price: 210,
  },
  {
    ownerId: 2,
    address: "789 Tracy St",
    city: "Houston",
    state: "Texas",
    country: "United States of America",
    lat: 63.7645358,
    lng: -80.4730327,
    name: "Bpp Academy",
    description: "Place where web developers are created",
    price: 230,
  },
  {
    ownerId: 3,
    address: "123 Vivian",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 35.7645358,
    lng: -36.4730327,
    name: "Cpp Academy",
    description: "Welcome to the brand new Hygge Hideaway!",
    price: 123,
  },
  {
    ownerId: 3,
    address: "456 Vivian",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 85.7645358,
    lng: -106.4730327,
    name: "Cpp Academy",
    description: "Welcome to the brand new Hygge Hideaway!",
    price: 123,
  },
  {
    ownerId: 3,
    address: "789 Vivian",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 75.7645358,
    lng: -116.4730327,
    name: "Cpp Academy",
    description: "Welcome to the brand new Hygge Hideaway!",
    price: 123,
  },
  {
    ownerId: 4,
    address: "441 Vivian",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 71.7645358,
    lng: -106.4730327,
    name: "Cpp Academy",
    description: "Welcome to the brand new Hygge Hideaway!",
    price: 123,
  },
  {
    ownerId: 4,
    address: "442 Vivian",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 71.7645358,
    lng: -106.4730327,
    name: "Cpp Academy",
    description: "Welcome to the brand new Hygge Hideaway!",
    price: 123,
  },
  {
    ownerId: 4,
    address: "443 Vivian",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 71.7645358,
    lng: -106.4730327,
    name: "Cpp Academy",
    description: "Welcome to the brand new Hygge Hideaway!",
    price: 123,
  },
]
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate(spots,{validate:true});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      country:'United States of America'
    }, {});
  //  await queryInterface.bulkDelete('Spots',{},{})

  }
};
