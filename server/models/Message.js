'use strict';
module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    conversation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'id'
      }
    }
  }, { timestamps: true });
  Messages.associate = function (models) {
    Messages.belongsTo(models.Conversations,
      { foreignKey: 'conversation', targetKey: 'id' });

    Messages.belongsTo(models.Users,
      { foreignKey: 'sender', targetKey: 'id' });
  };
  return Messages;
};
