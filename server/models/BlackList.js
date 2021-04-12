'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlackLists = sequelize.define('BlackLists', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      primaryKey: true
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      primaryKey: true
    }
  }, { timestamps: false });
  BlackLists.associate = function (models) {
    BlackLists.belongsTo(models.Conversations,
      { foreignKey: 'conversationId', targetKey: 'id' });

    BlackLists.belongsTo(models.Users,
      { foreignKey: 'userId', targetKey: 'id' });
  };
  return BlackLists;
};
