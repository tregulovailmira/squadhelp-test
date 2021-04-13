const { BlackLists, FavoriteLists } = require('../models');
const userQueries = require('./queries/userQueries');
const chatQueries = require('./queries/chatQueries');
const controller = require('../socketInit');
const functions = require('../utils/functions');

module.exports.addMessage = async (req, res, next) => {
  const {
    body: { recipient, messageBody, interlocutor },
    tokenData: { userId, firstName, lastName, displayName, avatar, email }
  } = req;

  const participants = [userId, recipient];

  participants.sort(
    (participant1, participant2) => participant1 - participant2);

  try {
    const newConversation = await chatQueries.getOrCreateConversationByParticipants(participants);

    const message = await chatQueries.createMessage(userId, messageBody, newConversation.id);

    const interlocutorId = participants.find((participant) => participant !== userId);

    const preview = functions.getConversationPreview({ ...newConversation, Messages: [message] });

    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        ...preview,
        interlocutor: {
          id: userId,
          firstName,
          lastName,
          displayName,
          avatar,
          email
        }
      }
    });

    return res.status(201).send({
      message,
      preview: { ...preview, interlocutor: interlocutor }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const {
    params: { interlocutorId },
    tokenData: { userId }
  } = req;

  const participants = [userId, +interlocutorId];

  participants.sort(
    (participant1, participant2) => participant1 - participant2);

  try {
    const messages = await chatQueries.findChatByParticipants(participants);

    const interlocutor = await userQueries.findUser(
      { id: +interlocutorId });

    return res.send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  const { tokenData: { userId } } = req;

  try {
    const conversations = await chatQueries.getConversationsForPreview(userId);
    const preview = conversations.map(conversation => {
      return functions.getConversationPreview(conversation);
    });

    const interlocutors = [];
    preview.forEach(conversation => {
      interlocutors.push(conversation.participants.find(
        (participant) => participant !== userId));
    });

    const senders = await chatQueries.getInterlocutors(interlocutors);

    preview.forEach((conversation) => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.id)) {
          const { id, firstName, lastName, displayName, avatar } = sender;
          conversation.interlocutor = { id, firstName, lastName, displayName, avatar };
        }
      });
    });

    return res.status(200).send(preview);
  } catch (err) {
    next(err);
  }
};

module.exports.toggleBlackAndFavoriteList = async (req, res, next) => {
  const {
    body,
    body: { participants },
    params: { interlocutorId },
    tokenData: { userId }
  } = req;

  try {
    if ('blackListFlag' in body) {
      const { body: { blackListFlag } } = req;

      const updatedConversation = await chatQueries.toggleList(...participants, userId, blackListFlag, BlackLists);
      const preparedConversation = functions.prepareConversation(updatedConversation);
      controller
        .getChatController()
        .emitChangeBlockStatus(interlocutorId, preparedConversation);

      return res.status(200).send(preparedConversation);
    }

    if ('favoriteFlag' in body) {
      const { body: { favoriteFlag } } = req;

      const updatedConversation = await chatQueries.toggleList(...participants, userId, favoriteFlag, FavoriteLists);
      const preparedConversation = functions.prepareConversation(updatedConversation);

      return res.status(200).send(preparedConversation);
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const {
    body: { catalogName, chatId },
    tokenData: { userId }
  } = req;

  try {
    const catalog = await chatQueries.createCatalog(userId, catalogName, chatId);
    const preparedCatalog = functions.prepareCatalog(catalog);

    return res.status(201).send(preparedCatalog);
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  const {
    tokenData: { userId }
  } = req;

  try {
    const catalogs = await chatQueries.getUserCatalogs(userId);
    const preparedCatalogs = catalogs.map(catalog => functions.prepareCatalog(catalog));

    return res.status(200).send(preparedCatalogs);
  } catch (err) {
    next(err);
  }
};

module.exports.updateCatalog = async (req, res, next) => {
  const {
    body,
    body: { catalogName, chatId, isRemoved },
    params: { catalogId }
  } = req;

  try {
    let updatedCatalog;

    if (body.chatId) {
      if (isRemoved) {
        updatedCatalog = await chatQueries.removeChatFromCatalog(catalogId, chatId);
      } else {
        updatedCatalog = await chatQueries.addNewChatToCatalog(catalogId, chatId);
      }
    }

    if (body.catalogName) {
      updatedCatalog = await chatQueries.updateNameCatalog(catalogId, catalogName);
    }

    const preparedCatalog = functions.prepareCatalog(updatedCatalog);
    return res.status(200).send(preparedCatalog);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  const {
    params: { catalogId }
  } = req;

  try {
    await chatQueries.deleteCatalog(catalogId);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
