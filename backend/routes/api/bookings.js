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


// added validation of booking
const validateBooking = [
  check("startDate").custom((value, { req }) => {
    const startDate = new Date(value);
    const now = new Date();
    if (startDate < now) {
      throw new Error("startDate cannot be in the past");
    }
    return true;
  }),
  check("endDate").custom((value, { req }) => {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(value);
    if (endDate <= startDate) {
      throw new Error("endDate cannot be on or before startDate");
    }
    return true;
  }),
  handleValidationErrors,
];




// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {

  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    include: [
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
      }
    ]
  })


  for (let i = 0; i < bookings.length; i++) {
    bookings[i] = bookings[i].toJSON();

    const previewImage = bookings[i].Spot.SpotImages[0].url;

    bookings[i].Spot.previewImage = previewImage;
    delete bookings[i].Spot.SpotImages;
  }

  return res.status(200).json({ Bookings: bookings })

});






// Edit a Booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {

  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    })
  }
  if (booking.userId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden'
    });
  }

  await booking.update(req.body);
  return res.status(200).json(booking)
});


// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    });
  };

  if (booking.userId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden"
    });
  };

  await booking.destroy();
  return res.status(200).json({
    message: "Successfully deleted"
  });
});


module.exports = router;