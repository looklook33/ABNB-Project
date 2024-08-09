const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
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
          where: { preview: true }, required: false
        },
      }
    ]
  })

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i].toJSON();
    if (booking.Spot) {
      bookings[i] = booking;
      if (booking.Spot.previewImage = booking.Spot.SpotImages.length) {
        booking.Spot.previewImage = booking.Spot.SpotImages[0].url
      } else {
        booking.Spot.previewImage = null
      }
      delete booking.Spot.SpotImages;
    }
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

  const { startDate, endDate } = req.body;
  const spot = await Spot.findByPk(booking.spotId);

  if (new Date(startDate) < new Date()) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
    });
  }

  const otherBookings = await Booking.findAll({
    where: {
      spotId: spot.id,
      id: { [Op.ne]: booking.id }, // Exclude current booking
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: startDate } },
            { endDate: { [Op.gte]: endDate } },
          ],
        },
      ],
    },
  });

  if (otherBookings.length > 0) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  await booking.update({
    startDate: startDate,
    endDate: endDate,
    updatedAt: new Date(),
  });

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

  if (new Date(booking.startDate) < new Date()) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted"
    })
  }

  await booking.destroy();
  return res.status(200).json({
    message: "Successfully deleted"
  });
});

module.exports = router;