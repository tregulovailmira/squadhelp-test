const { BlackLists, FavoriteLists, Messages, Conversations, Users, CatalogsToConversations, Catalogs } = require('../../models');
const db = require('../../models');

module.exports.createMessage = async (sender, body, conversation) => {
  const newMessage = await Messages.create({ sender, body, conversation });
  return newMessage.get({ plain: true });
};

module.exports.getOrCreateConversationByParticipants = async ([userId, interlocutorId]) => {
  const conversation = await Conversations.findOne({
    where: {
      userId,
      interlocutorId
    },
    include: [
      {
        model: BlackLists,
        required: false,
        attributes: ['userId']
      },
      {
        model: FavoriteLists,
        required: false,
        attributes: ['userId']
      }]
  });

  if (conversation) {
    return conversation.get({ plain: true });
  }

  const newConversation = await Conversations.create({
    userId,
    interlocutorId
  });

  return { ...newConversation.dataValues, BlackLists: [], FavoriteLists: [] };
};

module.exports.findChatByParticipants = async ([userId, interlocutorId]) => {
  return await Messages.findAll({
    include: [{
      model: Conversations,
      where: {
        userId,
        interlocutorId
      }
    }],
    attributes: [['id', '_id'], 'sender', 'body', 'conversation', 'createdAt', 'updatedAt'],
    order: [['createdAt', 'ASC']]
  }).map(item => item.get({ plain: true }));
};

module.exports.getConversationsForPreview = async (userId) => {
  const conversations = await Conversations.findAll({
    where: {
      [db.Sequelize.Op.or]: [{ userId }, { interlocutorId: userId }]
    },
    include: [
      {
        model: Messages,
        order: [['createdAt', 'DESC']],
        limit: 1
      },
      {
        model: BlackLists,
        required: false,
        attributes: ['userId']
      },
      {
        model: FavoriteLists,
        required: false,
        attributes: ['userId']
      }
    ]
  });

  return conversations.map(conversation => conversation.get({ plain: true }));
};

module.exports.getInterlocutors = async (id) => {
  return await Users.findAll({
    where: { id },
    attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar']
  }).map(user => user.get({ plain: true }));
};

module.exports.toggleList = async (userId, interlocutorId, currentUser, listFlag, list) => {
  const foundedConversation = await Conversations.findOne({
    where: { userId, interlocutorId },
    attributes: ['id'],
    raw: true
  });

  if (listFlag) {
    await list.create({ userId: currentUser, conversationId: foundedConversation.id });
  } else {
    const deleteList = await list.findOne({ where: { userId: currentUser, conversationId: foundedConversation.id } });
    await deleteList.destroy();
  }
  const updatedConversation = await Conversations.findOne({
    where: { userId, interlocutorId },
    include: [
      {
        model: BlackLists,
        attributes: ['userId']
      },
      {
        model: FavoriteLists,
        attributes: ['userId'],
        required: false
      }
    ]
  });
  return updatedConversation.get({ plain: true });
};

module.exports.createCatalog = async (userId, catalogName, conversationId) => {
  const newCatalog = await Catalogs.create({ userId, catalogName });
  await CatalogsToConversations.create({ conversationId, catalogId: newCatalog.id });

  const createdCatalog = await Catalogs.findOne({
    where: { id: newCatalog.id },
    include: [{
      model: CatalogsToConversations,
      attributes: ['conversationId']
    }]
  });

  return createdCatalog.get({ plain: true });
};

module.exports.getUserCatalogs = async (userId) => {
  const catalogs = await Catalogs.findAll({
    where: { userId },
    include: [{
      model: CatalogsToConversations,
      attributes: ['conversationId']
    }]
  });

  return catalogs.map(catalog => catalog.get({ plain: true }));
};

module.exports.addNewChatToCatalog = async (catalogId, conversationId) => {
  await CatalogsToConversations.create({ catalogId, conversationId });

  const updatedCatalog = await Catalogs.findOne({
    where: { id: catalogId },
    include: [{
      model: CatalogsToConversations,
      attributes: ['conversationId']
    }]
  });

  return updatedCatalog.get({ plain: true });
};

module.exports.removeChatFromCatalog = async (catalogId, conversationId) => {
  const foundedChat = await CatalogsToConversations.findOne({
    where: { catalogId, conversationId }
  });
  await foundedChat.destroy();

  const updatedCatalog = await Catalogs.findOne({
    where: { id: catalogId },
    include: [{
      model: CatalogsToConversations,
      attributes: ['conversationId']
    }]
  });

  return updatedCatalog.get({ plain: true });
};

module.exports.updateNameCatalog = async (id, catalogName) => {
  await Catalogs.update(
    { catalogName },
    { where: { id } }
  );

  const updatedCatalog = await Catalogs.findOne({
    where: { id },
    include: [{
      model: CatalogsToConversations,
      attributes: ['conversationId']
    }]
  });

  return updatedCatalog.get({ plain: true });
};

module.exports.deleteCatalog = async (id) => {
  const foundedCatalog = await Catalogs.findByPk(id);
  await foundedCatalog.destroy();
};
