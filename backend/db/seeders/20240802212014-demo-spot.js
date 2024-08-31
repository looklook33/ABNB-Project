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
    description: "This hotel is pretty much to the best hotel I have stayed in.The service from the dinning staff and room service was excellent. The front desk checking in process could use more training and accommodate mistake during booking of hotel. The food that the hotel has to offer was a great variety and the taste was great. The beaches were beautiful. My family had a great time here and will be coming back sometime in the near future. What a great place to relax and enjoy.",
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
    description:  "What's not to love about this place! One of the most unique homes on the lake comes with the best views on the lake, private outdoor pool and hot tub, excellent location and gives you access to all of the fantastic Knolls amenities (shared indoor pool/hot tub, sauna, steam room, tennis courts and more). Not that you need to ever leave the house, but if you do you're a short drive or boat ride to Redhead Yacht Club, Margaritaville Landshark Bar, Shorty Pants and many other great spots!",
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
    description: "The Lighthouse is a lakefront property close to downtown Wisconsin Dells. You’ll love our house because of the coziness, the location, and the views. Also the complimentary use of three kayaks, two row boats and one canoe!  Our house is good for couples, families (with kids), and groups up to 14.",
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
    description:  "Cute little plantation style facility. Older but clean and off the beaten path which we loved. Breakfast would be classified as more of a continental breakfast of which choices were not as healthy as a diabetic would hope for So we did opt to eat breakfast away from there. Staff was very friendly and helpful. Pool was small but well kept. Would stay again.",
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
    name: "Exquisite Private Lake Front Family Hom",
    description: "3.5 acre end of the road Custom built home, on a small lake perfect for kayaking or fishing. Within minutes to multiple larger lakes and beaches. This area is secluded, spacious and peaceful  with many different areas on the property to relax with friends and family. The large deck is a great place to grill out and to watch the spectacular sunsets. Perfect for a week long stay.  Five quaint river towns are within a half hour drive.",
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
    description:"SUNRISE SANCTUARY has a Native American theme with vivid colors and designs that follow somewhat of a Southwestern flair, but holding true to the Native American love and respect for our wildlife, beautiful mountainous land and clean unspoiled environment, free from the hustles and bustles of city life.",
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
    name:  "Cove at 420: Modern Lake Front Home near Chicago",
    description:  "Welcome to the Cove at 420.  A modern vacation paradise where indoor and outdoor lines blur.  Every space is designed for enjoyment.  A short 75 minute drive from Chicago, this is a true retreat.  Wake up to beautiful sunrise views or enjoy them from a kayak on the water.  We offer kayaks, paddle boards, a catamaran, hot tub & sauna, Sonos sound system, a fire pit and plenty of yard games for our guests.",
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
