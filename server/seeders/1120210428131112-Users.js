'use strict';
const { hash } = require('bcrypt');
const CONSTANTS = require('../constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'moderator',
        lastName: 'moderatorovich',
        displayName: 'moderator',
        password: await hash('123456', CONSTANTS.SALT_ROUNDS),
        email: 'moderator@test.test',
        avatar: 'anon.png',
        role: CONSTANTS.MODERATOR,
        balance: 0
      }
    ], {});
  }
};
