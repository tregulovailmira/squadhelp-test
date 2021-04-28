'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Offers', 'moderationStatus',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Offers', 'moderationStatus');
  }
};
