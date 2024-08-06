const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { where, Op } = require('sequelize');
const router = express.Router();

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

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {

    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ["description", "createdAt", "updatedAt"]
                },
                include: {
                    model: SpotImage,
                    attributes: ['url'],
                    where: { preview: true }
                },
            },

            {
                model: ReviewImage,
                attributes: ['id', 'url']

            }
        ]
    })
    // 
    for (let i = 0; i < reviews.length; i++) {
        reviews[i] = reviews[i].toJSON();
        const previewImage = reviews[i].Spot.SpotImages[0].url;

        reviews[i].Spot.previewImage = previewImage;
        delete reviews[i].Spot.SpotImages;
    }

    return res.status(200).json({ Reviews: reviews });
})


//Add an Image to a Review based on the Review's id

router.post("/:reviewId/images", requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }
  
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
  
    const imageCount = await ReviewImage.count({
      where: { reviewId: req.params.reviewId },
    });
    if (imageCount >= 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached",
      });
    }
  
    const newImage = await review.createReviewImage(req.body);
    const response = {
      id: newImage.id,
      url: newImage.url,
    };
    return res.status(200).json(response);
  });

// Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        });
    }
    if (review.userId !== req.user.id) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    }

    await review.update(req.body);

    return res.status(200).json(review);
})


// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        });
    }
    if (review.userId !== req.user.id) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    }
    await review.destroy();
    return res.status(200).json({
        message: 'Successfully deleted'
    })
})

module.exports = router;