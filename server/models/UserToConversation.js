'use strict';
module.exports = (sequelize, DataTypes) => {
  const UsersToConversations = sequelize.define('UsersToConversations', {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {});
  UsersToConversations.associate = function (models) {
    // associations can be defined here
  };
  return UsersToConversations;
};
