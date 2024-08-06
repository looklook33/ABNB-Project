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
    userId:1,
    startDate:'2021-12-12',
    endDate:'2021-12-21'
  },
  {
    spotId:2,
    userId:2,
    startDate:'2011-12-12',
    endDate:'2011-12-21'
  },
  {
    spotId:3,
    userId:3,
    startDate:'2021-10-12',
    endDate:'2021-10-21'
  },
  {
    spotId: 1,
    userId: 4,
    startDate: "2025-12-20",
    endDate: "2025-12-26",
  }

]
module.exports = {
  async up (queryInterface, Sequelize) {

    await Booking.bulkCreate(bookings, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
