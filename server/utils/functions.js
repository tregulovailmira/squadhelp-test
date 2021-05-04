const bd = require('../models/index');
const CONSTANTS = require('../constants');

module.exports.createWhereForAllContests = (
  typeIndex, contestId, industry, awardSort) => {
  const object = {
    where: {},
    order: []
  };
  if (typeIndex) {
    Object.assign(object.where, { contestType: getPredicateTypes(typeIndex) });
  }
  if (contestId) {
    Object.assign(object.where, { id: contestId });
  }
  if (industry) {
    Object.assign(object.where, { industry: industry });
  }
  if (awardSort) {
    object.order.push(['prize', awardSort]);
  }
  Object.assign(object.where, {
    status: {
      [bd.Sequelize.Op.or]: [
        CONSTANTS.CONTEST_STATUS_FINISHED,
        CONSTANTS.CONTEST_STATUS_ACTIVE
      ]
    }
  });
  object.order.push(['id', 'desc']);
  return object;
};

function getPredicateTypes (index) {
  return { [bd.Sequelize.Op.or]: [types[index].split(',')] };
}

const types = [
  '',
  'name,tagline,logo',
  'name',
  'tagline',
  'logo',
  'name,tagline',
  'logo,tagline',
  'name,logo'
];

module.exports.getConversationPreview = (conversation) => {
  const { id, BlackLists, FavoriteLists, Messages, interlocutorId, userId } = conversation;

  const { sender, body, createdAt } = Messages[0];
  const participants = [userId, interlocutorId];

  const blackList = participants.map(participant =>
    BlackLists.map(({ userId }) => userId).includes(participant));

  const favoriteList = participants.map(participant =>
    FavoriteLists.map(({ userId }) => userId).includes(participant)
  );

  return {
    _id: id,
    sender: sender,
    text: body,
    createAt: createdAt,
    participants,
    blackList,
    favoriteList
  };
};

module.exports.prepareConversation = (conversation) => {
  const { id, userId, interlocutorId, BlackLists, FavoriteLists, createdAt, updatedAt } = conversation;

  const participants = [userId, interlocutorId];

  const blackList = participants.map(participant =>
    BlackLists.map(({ userId }) => userId).includes(participant));

  const favoriteList = participants.map(participant =>
    FavoriteLists.map(({ userId }) => userId).includes(participant)
  );

  return {
    _id: id,
    participants,
    createdAt,
    updatedAt,
    blackList,
    favoriteList
  };
};

module.exports.prepareCatalog = (catalog) => {
  const { id, catalogName, userId, CatalogsToConversations } = catalog;

  const chats = CatalogsToConversations.map(item => item.conversationId);

  return {
    _id: id,
    catalogName,
    userId,
    chats
  };
};
