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
    url:"/images/cancun1.jpg",
    preview:true
  },
  {
    spotId: 1,
    url: "/images/cancun2.jpg",
    preview: false
  },
  {
    spotId: 1,
    url: "/images/cancun3.jpg",
    preview: false
  },
  {
    spotId: 1,
    url: "/images/cancun4.jpg",
    preview: false
  },
  {
    spotId: 1,
    url: "/images/cancun5.jpg",
    preview: false
  },
  {
    spotId:2,
    url:"/images/tian2.jpg",
    preview:true
  },
  {
    spotId:2,
    url:"/images/tian1.jpg",
    preview:false
  },
  {
    spotId:2,
    url:"/images/tian4.jpg",
    preview:false
  },
  {
    spotId:2,
    url:"/images/tian4.jpg",
    preview:false
  },
  {
    spotId:2,
    url:"/images/2-5.webp",
    preview:false
  },
  {
    spotId:3,
    url:"/images/PadreIsland1.jpg",
    preview:true
  },
  {
    spotId:3,
    url:"/images/PadreIsland2.jpg",
    preview:false
  },
  {
    spotId:3,
    url:"/images/PadreIsland3.jpg",
    preview:false
  },
  {
    spotId:3,
    url:"/images/PadreIsland4.jpg",
    preview:false
  },
  {
    spotId:3,
    url:"/images/PadreIsland5.jpg",
    preview:false
  },  
  {
    spotId: 4,
    url: "/images/Kauai5.jpg",
    preview: true
  },
  {
    spotId: 4,
    url: "/images/Kauai2.jpg",
    preview: false
  },
  {
    spotId: 4,
    url: "/images/Kauai3.jpg",
    preview: false
  },
  {
    spotId: 4,
    url: "/images/Kauai4.jpg",
    preview: false
  },
  {
    spotId: 4,
    url: "/images/Kauai6.jpg",
    preview: false
  },
  {
    spotId:5,
    url:"/images/cozumei1.jpg",
    preview:true
  },
  {
    spotId:6,
    url:"/images/cozumei2.jpg",
    preview:true
  },
  {
    spotId:7,
    url:"/images/maui1.jpg",
    preview:true
  },
  {
    spotId: 8,
    url: "/images/4-5.webp",
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
    return queryInterface.bulkDelete(options, spotImages, {});

  }
};
