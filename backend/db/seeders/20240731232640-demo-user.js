'use strict';
/** @type {import('sequelize-cli').Migration} */
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const users =[
  { 
    firstName:'Mark',
    lastName:'Zhan',
    email: 'demo@user.io',
    username: 'Demo-lition',  
    hashedPassword: bcrypt.hashSync('password')
  },
  { 
    firstName:'Gavin',
    lastName:'Zhang',
    email: 'user1@user.io',
    username: 'FakeUser1',
    hashedPassword: bcrypt.hashSync('password2')
  },
  { 
    firstName:'Sarah',
    lastName:'Jone',
    email: 'user2@user.io',
    username: 'FakeUser2',
    hashedPassword: bcrypt.hashSync('password3')
  },
  { 
    firstName:'John',
    lastName:'Smith',
    email: "john.smith@gmail.com",
    username: 'FakeUser3',
    hashedPassword: bcrypt.hashSync('secret password')
  }

];

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate(users, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2','FakeUser3'] }
    }, {});
  }
};
