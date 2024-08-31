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
    name: "Trails edge lake housey",
    description: "Adventure meets luxury with this one of a kind climate controlled glamping excursion. All the best of nature combined with the luxury of an upscale hotel room. Gaze up at the stars or out at the rolling Eureka forestry from the comfort of your 100% climate controlled dome. Soak in the jetted tub cookout on the deck and drink cocktails from the built in hammock. 15min to Eureka Springs downtown. NO WIFI and cell service is spotty.",
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
    address: "123 Tracy St",
    city: "Houston",
    state: "Texas",
    country: "United States of America",
    lat: 33.7645358,
    lng: -34.4730327,
    name: "Lake Hamilton",
    description:  "Enjoy one of the best views that Lake Hamilton has to offer while spending afternoons relaxing in the pool or playing on the lake!  Waterfront property with swimming pool spans across 2 levels with tremendous mountain and lake views from both inside and outside the house.  The multi-level family home has 5 Bedrooms, a fully-stocked kitchen with two adjoining dining areas, and large living space.  A covered dock and pool are also available for your use!",
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
