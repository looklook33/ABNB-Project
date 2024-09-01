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
    state: "CC",
    country: "Mexico",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "Hyatt",
    description: "Great dessert bar, delicious food, and amazing views.",
    price: 800,
  },
  {
    ownerId: 1,
    address: "4242 Copacabana",
    city: "Rio de Janeiro",
    state: "RDJ",
    country: "Brazil",
    lat: 40.7645358,
    lng: -120.4730327,
    name: "Fairmont",
    description: "Fantastic location at Copacabana beach, with lots of nearby restaurants. Easy to get a car, and move around",
    price: 140,
  },
  {
    ownerId: 1,
    address: "4001 Padre Blvd",
    city: "Padre Island",
    state: "TX",
    country: "United States of America",
    lat: 50.7645358,
    lng: -100.4730327,
    name: "Shell Beach",
    description: "This shell-covered beach on Padre Island, where kids can have a lot of fun.",
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
    description:  "Kauai is an island in the Central Pacific, part of the Hawaiian archipelago.",
    price: 200,
  },
  {
    ownerId: 2,
    address: "456 Tracy St",
    city: "Cozumel",
    state: "CC",
    country: "Mexico",
    lat: 21.7645358,
    lng: -39.4730327,
    name: "APP island",
    description: "The blue sea is breathtakingly beautiful, with clarity that feels almost refreshing.",
    price: 210,
  },
  {
    ownerId: 2,
    address: "app academy",
    city: "APP",
    state: "APP",
    country: "Mexico",
    lat: 63.7645358,
    lng: -80.4730327,
    name: "APP",
    description:"Cozumel is Mexico's largest island—33 mi/53 km long and 8 mi/13 km wide. The island is very flat. ",
    price: 230,
  },
  {
    ownerId: 3,
    address: "Kaanapali Beach",
    city: "Maui",
    state: "HI",
    country: "United States of America",
    lat: 35.7645358,
    lng: -36.4730327,
    name:  "Maui Island",
    description: "Maui is an island in the Central Pacific, part of the Hawaiian archipelago.",
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
    name: "App Academy",
    description: "App Academy!",
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
