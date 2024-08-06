const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { where, Op } = require('sequelize');
const { UPDATE } = require('sequelize/lib/query-types');
const { underscoredIf } = require('sequelize/lib/utils');
const router = express.Router();

//added validation of spot
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage("Name must be less than 50 characters")
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors
];

//added validation for reviews
const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];


//Get all spots
router.get("/", async (req, res) => {

  const spots = await Spot.findAll({
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: SpotImage,
        attributes: ["url"],
        where: { preview: true },
        required: false,
      },
    ],
    group: ["Spot.id", "SpotImages.id"],
    //  subQuery: false,
  });
  const spotsWithDetails = spots.map((spot) => {
    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: spot.dataValues.avgRating
        ? parseFloat(spot.dataValues.avgRating).toFixed(1)
        : "No rating yet.",
      previewImage: spot.SpotImages.length
        ? spot.SpotImages[0].url
        : "No preview image yet.",
    };
  });
  return res.status(200).json({
    Spots: spotsWithDetails,
  });
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;
  const currentSpots = await Spot.findAll({
    where: { ownerId: user.id },
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: SpotImage,
        attributes: ["url"],
        where: { preview: true },
        required: false,
      },
    ],
    group: ["Spot.id", "SpotImages.id"],
  })

  const spotsWithDetails = currentSpots.map((spot) => {

    const spotJson = spot.toJSON();

    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: spot.dataValues.avgRating
        ? parseFloat(spotJson.dataValues.avgRating).toFixed(1)
        : "No rating yet.",
      previewImage: spotJson.SpotImages.length
        ? spotJson.SpotImages[0].url
        : "No preview image yet.",
    };
  });

  return res.status(200).json({
    Spots: spotsWithDetails,
  });


});

//Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {

  // return res.json(newSpot)
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      { model: SpotImage },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        as: "Owner",
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
  });
  // console.log(reviews);
  // console.log("numReviews ->", reviews.length);
  spot.dataValues.numReviews = reviews.length;
  spot.dataValues.createdAt = spot.dataValues.createdAt;
  spot.dataValues.updatedAt = spot.dataValues.updatedAt;

  return res.status(200).json(spot);
});


//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const spot = await Spot.create({
    ownerId: req.user.id,
    address, city, state, country, lat, lng, name, description, price
  })

  return res.status(201).json(spot)

});

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json(
      {
        message: "Spot couldn't be found"
      }
    )
  }

  const currentId = req.user.id;
  if (currentId !== spot.ownerId) {
    return res.status(403).json({
      message: 'Forbidden'
    })

  }

  const { url, preview } = req.body;

  const newImage = await SpotImage.create({
    id: spotId,
    url: url,
    preview: preview
  })

  return res.status(201).json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  })
})

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json(
      {
        message: "Spot couldn't be found"
      }
    )
  }

  const currentId = req.user.id;
  if (currentId !== spot.ownerId) {
    return res.status(403).json({
      message: 'Forbidden'
    })
  }
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  if (address) spot.address = address;
  if (city) spot.city = city;
  if (state) spot.state = state;
  if (country) spot.country = country;
  if (lat) spot.let = lat;
  if (lng) spot.lng = lng;
  if (name) spot.name = name;
  if (description) spot.description = description;
  if (price) spot.price = price;

  await spot.save();
  return res.status(200).json(spot)
})


// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {

  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json(
      {
        message: "Spot couldn't be found"
      }
    )
  }

  const currentId = req.user.id;
  if (currentId !== spot.ownerId) {
    return res.status(403).json({
      message: 'Forbidden'
    })
  }

  await spot.destroy();
  return res.status(200).json(
    {
      message: "Successfully deleted"
    }
  )
})
// -------------------- Spots routes Related to Reviews --------------- 

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews',  async (req, res) => {

  const spot  = await Spot.findByPk(req.params.spotId);

  if (!spot){
    return res.status(404).json(
      {
        message: "Spot couldn't be found"
      }
    )
  }

  const spotReviews = await Review.findAll({ 
      where: {
          spotId: req.params.spotId,
      },

      include: [
          {
              model: User,
              attributes: ['id', 'firstName', 'lastName']
          }, 
          {
              model: ReviewImage,
              attributes: ['id', 'url']

          }
      ]
  })

 return res.status(200).json({ Reviews: spotReviews });

})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {

  const spot  = await Spot.findByPk(req.params.spotId);

  if (!spot){
    return res.status(404).json(
      {
        message: "Spot couldn't be found"
      }
    )
  }

const existingReview = await Review.findOne({
  where :{userId: req.user.id, spotId: spot.id}
})

if (existingReview){
  return res.status(500).json(
    {
      message: "User already has a review for this spot"
    }
  )
}

const newReview  = await spot.createReview({userId: req.user.id, ...req.body});

return res.status(201).json(newReview)

})

module.exports = router;