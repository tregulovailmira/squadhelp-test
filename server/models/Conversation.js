'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversations = sequelize.define('Conversations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    interlocutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
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
  }, { timestamps: true });
  Conversations.associate = function (models) {
    Conversations.hasMany(models.Messages,
      { foreignKey: 'conversation', sourceKey: 'id' });

    Conversations.belongsTo(models.Users,
      { foreignKey: 'userId', targetKey: 'id' });

    Conversations.belongsTo(models.Users,
      { foreignKey: 'interlocutorId', targetKey: 'id' });

    Conversations.hasMany(models.BlackLists,
      { foreignKey: 'conversationId', sourceKey: 'id' });

    Conversations.hasMany(models.FavoriteLists,
      { foreignKey: 'conversationId', sourceKey: 'id' });
  };
  return Conversations;
};
