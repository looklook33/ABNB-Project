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
    address: "Blvd. Kukulcan",
    city: "Cancun",
    state: "Cancun",
    country: "Mexico",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "Hyatt",
    description: "This hotel is pretty much to the best hotel I have stayed in.",
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
    name: "Luxury Knolls Mansion",
    description:  "What's not to love about this place!",
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
    name: "The Lighthouse",
    description: "The Lighthouse is a lakefront property close to downtown Wisconsin Dells.",
    price: 140,
  },
  {
    ownerId: 2,
    address: "4396 Rice ST",
    city: "Kauai",
    state: "HI",
    country: "United States of America",
    lat: 33.7645358,
    lng: -34.4730327,
    name: "Kauai Island",
    description:  "Cute little plantation style facility.",
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
    name: "APP island",
    description: "3.5 acre end of the road Custom built home, on a small lake perfect for kayaking or fishing. Within minutes to multiple larger lakes and beaches. This area is secluded, spacious and peaceful.",
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
    name: "Sunrise Sanctuary",
    description:"SUNRISE SANCTUARY has a Native American theme with vivid colors and designs that follow somewhat of a Southwestern flair, but holding true to the Native American love and respect for our wildlife.",
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
    name:  "Modern Lake",
    description:  "Welcome to the Cove at 420. A modern vacation paradise where indoor and outdoor lines blur.  Every space is designed for enjoyment.  A short 75 minute drive from Chicago, this is a true retreat.  Wake up to beautiful sunrise.",
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
