const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { where,Op } = require('sequelize');
const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Username is required'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password); 

    //Error response: User already exists with the specified email or username 
    const existingUser = await User.findOne({
      where:{[Op.or]:{username:username, email:email}}
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(500).json({
          message: "User already exists",
          errors: {
            email: "Email already exists",
          },
        });
      } else if (existingUser.username === username) {
        return res.status(500).json({
          message: "User already exists",
          errors: {
            username: "Username already exists",
          },
        });
      }
    }

    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.status(201).json({
      user: safeUser
    });
  }
);

module.exports = router;