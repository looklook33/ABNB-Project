'use strict';

/** @type {import('sequelize-cli').Migration} */
const {Booking} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const bookings = [
  {
    spotId:1,
    userId:2,
    startDate:'2024-12-12',
    endDate:'2024-12-21'
  },
  {
    spotId:2,
    userId:3,
    startDate:'2024-12-12',
    endDate:'2024-12-21'
  },
  {
    spotId:3,
    userId:4,
    startDate:'2024-10-12',
    endDate:'2024-10-21'
  },
]
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate(bookings, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, bookings, {});
  }
};
