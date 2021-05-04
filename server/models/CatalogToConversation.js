'use strict';
module.exports = (sequelize, DataTypes) => {
  const CatalogsToConversations = sequelize.define('CatalogsToConversations', {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'id'
      },
      primaryKey: true
    },
    catalogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Catalogs',
        key: 'id'
      },
      primaryKey: true

    }
  }, { timestamps: false });
  CatalogsToConversations.associate = function (models) {
    CatalogsToConversations.belongsTo(models.Catalogs,
      { foreignKey: 'catalogId', targetKey: 'id' });
  };
  return CatalogsToConversations;
};
