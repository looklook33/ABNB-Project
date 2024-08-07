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


//Get all Spots

router.get('/', async (req, res) => {

  const spots = await Spot.findAll({
    include: [
      { model: Review },
      { model: SpotImage }
    ],
  });

  for (let i = 0; i < spots.length; i++) {

    spots[i] = spots[i].toJSON();

    const totalStar = spots[i].Reviews.reduce((sum, review) => sum + review.stars, 0)
    const avgRating = totalStar / (spots[i].Reviews.length).toFixed(1);

    if (spots[i].Reviews.length) {
      spots[i].avgRating = avgRating
    } else {
      spots[i].avgRating = null;
    }

    delete spots[i].Reviews;

    if (spots[i].SpotImages.length) {
      spots[i].previewImage = spots[i].SpotImages[0].url
    } else {
      spots[i].previewImage = null
    }

    delete spots[i].SpotImages;
  }

  return res.status(200).json({
    Spots: spots,
  })
})

//Get all Spots owned by the Current User

router.get('/current', requireAuth, async (req, res) => {
  const spots = await Spot.findAll({

    where: { ownerId: req.user.id },
    include: [
      { model: Review },
      { model: SpotImage }
    ],
  });

  for (let i = 0; i < spots.length; i++) {

    spots[i] = spots[i].toJSON();

    const totalStar = spots[i].Reviews.reduce((sum, review) => sum + review.stars, 0)
    const avgRating = totalStar / (spots[i].Reviews.length).toFixed(1);

    if (spots[i].Reviews.length) {
      spots[i].avgRating = avgRating
    } else {
      spots[i].avgRating = null;
    }

    delete spots[i].Reviews;

    if (spots[i].SpotImages.length) {
      spots[i].previewImage = spots[i].SpotImages[0].url
    } else {
      spots[i].previewImage = null
    }

    delete spots[i].SpotImages;
  }

  return res.status(200).json({
    Spots: spots,
  })

})

//Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {

  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      },
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

  const totalStar = reviews.reduce((sum, review) => sum + review.stars, 0)
  const avgRating = totalStar / (reviews.length).toFixed(1);

  if (reviews.length) {
    spot.avgStarRating = avgRating
  } else {
    spot.avgStarRating = null;
  }

  spot.dataValues.avgStarRating = spot.avgStarRating;
  spot.dataValues.numReviews = reviews.length;

  return res.status(200).json(spot);
});


//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {

  const spot = await Spot.create({
    ownerId: req.user.id,
    ...req.body
  })

  return res.status(201).json(spot)

});

//Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const newImage = await spot.createSpotImage(req.body);
  const response = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  };
  return res.status(200).json(response);
});

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json(
      {
        message: "Spot couldn't be found"
      }
    )
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden'
    })
  }

  const updatedSpot = await spot.update(req.body);
  return res.status(200).json(updatedSpot)
})


// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {

  const spot = await Spot.findByPk(req.params.spotId);
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
router.get('/:spotId/reviews', async (req, res) => {

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
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

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json(
      {
        message: "Spot couldn't be found"
      }
    )
  }

  const existingReview = await Review.findOne({
    where: { userId: req.user.id, spotId: spot.id }
  })

  if (existingReview) {
    return res.status(500).json(
      {
        message: "User already has a review for this spot"
      }
    )
  }

  const newReview = await spot.createReview({ userId: req.user.id, ...req.body });

  return res.status(201).json(newReview)

})

// -------------------- Spots routes Related to Bookings --------------- 

// Get all Bookings for a Spot based on the Spot's id




// Create a Booking from a Spot based on the Spot's id

module.exports = router;