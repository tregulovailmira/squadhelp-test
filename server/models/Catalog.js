'use strict';
module.exports = (sequelize, DataTypes) => {
  const Catalogs = sequelize.define('Catalogs', {
    catalogName: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false
    }
  }, { timestamps: false });
  Catalogs.associate = function (models) {
    Catalogs.hasMany(models.CatalogsToConversations,
      { foreignKey: 'catalogId', sourceKey: 'id' });
  };
  return Catalogs;
};
