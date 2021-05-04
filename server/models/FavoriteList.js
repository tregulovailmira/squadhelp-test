'use strict';

module.exports = (sequelize, DataTypes) => {
  const FavoriteLists = sequelize.define('FavoriteLists', {
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
  FavoriteLists.associate = function (models) {
    FavoriteLists.belongsTo(models.Conversations,
      { foreignKey: 'conversationId', targetKey: 'id' });

    FavoriteLists.belongsTo(models.Users,
      { foreignKey: 'userId', targetKey: 'id' });
  };
  return FavoriteLists;
};
