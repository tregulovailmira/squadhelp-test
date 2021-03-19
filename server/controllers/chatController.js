/* eslint-disable no-prototype-builtins */
const Conversation = require('../models/mongoModels/conversation');
const Message = require('../models/mongoModels/Message');
const Catalog = require('../models/mongoModels/Catalog');
const db = require('../models/index');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');

module.exports.addMessage = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort(
    (participant1, participant2) => participant1 - participant2);
  try {
    const newConversation = await Conversation.findOneAndUpdate({
      participants
    },
    { participants, blackList: [false, false], favoriteList: [false, false] },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      useFindAndModify: false
    });
    const message = new Message({
      sender: req.tokenData.userId,
      body: req.body.messageBody,
      conversation: newConversation._id
    });
    await message.save();
    message._doc.participants = participants;
    const interlocutorId = participants.filter(
      (participant) => participant !== req.tokenData.userId)[0];
    const preview = {
      _id: newConversation._id,
      sender: req.tokenData.userId,
      text: req.body.messageBody,
      createAt: message.createdAt,
      participants,
      blackList: newConversation.blackList,
      favoriteList: newConversation.favoriteList
    };
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        _id: newConversation._id,
        sender: req.tokenData.userId,
        text: req.body.messageBody,
        createAt: message.createdAt,
        participants,
        blackList: newConversation.blackList,
        favoriteList: newConversation.favoriteList,
        interlocutor: {
          id: req.tokenData.userId,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email
        }
      }
    });
    res.send({
      message,
      preview: Object.assign(preview, { interlocutor: req.body.interlocutor })
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
    const messages = await Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData'
        }
      },
      { $match: { 'conversationData.participants': participants } },
      { $sort: { createdAt: 1 } },
      {
        $project: {
          _id: 1,
          sender: 1,
          body: 1,
          conversation: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    const interlocutor = await userQueries.findUser(
      { id: +interlocutorId });
    res.send({
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
  try {
    const conversations = await Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData'
        }
      },
      {
        $unwind: '$conversationData'
      },
      {
        $match: {
          'conversationData.participants': req.tokenData.userId
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: '$conversationData._id',
          sender: { $first: '$sender' },
          text: { $first: '$body' },
          createAt: { $first: '$createdAt' },
          participants: { $first: '$conversationData.participants' },
          blackList: { $first: '$conversationData.blackList' },
          favoriteList: { $first: '$conversationData.favoriteList' }
        }
      }
    ]);
    const interlocutors = [];
    conversations.forEach(conversation => {
      interlocutors.push(conversation.participants.find(
        (participant) => participant !== req.tokenData.userId));
    });
    const senders = await db.Users.findAll({
      where: {
        id: interlocutors
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar']
    });
    conversations.forEach((conversation) => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar
          };
        }
      });
    });
    res.send(conversations);
  } catch (err) {
    next(err);
  }
};

const blackList = async (blackListFlag, participants, userId) => {
  const predicate = 'blackList.' + participants.indexOf(userId);
  const updatedConversation = await Conversation.findOneAndUpdate(
    { participants },
    { $set: { [predicate]: blackListFlag } }, { new: true });
  const interlocutorId = participants.filter(
    (participant) => participant !== userId)[0];
  controller.getChatController().emitChangeBlockStatus(interlocutorId, updatedConversation);
  return updatedConversation;
};

const favoriteChat = async (favoriteFlag, participants, userId) => {
  const predicate = 'favoriteList.' + participants.indexOf(userId);
  const updatedConversation = await Conversation.findOneAndUpdate(
    { participants },
    { $set: { [predicate]: favoriteFlag } }, { new: true });
  return updatedConversation;
};

module.exports.toggleBlackAndFavoriteList = async (req, res, next) => {
  const { body, tokenData: { userId } } = req;

  try {
    if (body.hasOwnProperty('blackListFlag')) {
      const { body: { blackListFlag, participants } } = req;

      const updatedConversation = await blackList(blackListFlag, participants, userId);
      res.send(updatedConversation);
    }

    if (body.hasOwnProperty('favoriteFlag')) {
      const { body: { favoriteFlag, participants } } = req;

      const updatedConversation = await favoriteChat(favoriteFlag, participants, userId);
      res.send(updatedConversation);
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const catalog = new Catalog({
    userId: req.tokenData.userId,
    catalogName: req.body.catalogName,
    chats: [req.body.chatId]
  });
  try {
    await catalog.save();
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

const updateNameCatalog = async (catalogId, userId, catalogName) => {
  const updatedCatalog = await Catalog.findOneAndUpdate({
    _id: catalogId,
    userId
  }, { catalogName }, { new: true });
  return updatedCatalog;
};

const addNewChatToCatalog = async (catalogId, userId, chatId) => {
  const updatedCatalog = await Catalog.findOneAndUpdate({
    _id: catalogId,
    userId
  }, { $addToSet: { chats: chatId } }, { new: true });
  return updatedCatalog;
};

const removeChatFromCatalog = async (catalogId, userId, chatId) => {
  const catalog = await Catalog.findOneAndUpdate({
    _id: catalogId,
    userId
  }, { $pull: { chats: chatId } }, { new: true });
  return catalog;
};

module.exports.updateCatalog = async (req, res, next) => {
  const {
    body,
    body: { catalogName, chatId, isRemoved },
    params: { catalogId },
    tokenData: { userId }
  } = req;

  try {
    if (body.hasOwnProperty('catalogName')) {
      const updatedCatalog = await updateNameCatalog(catalogId, userId, catalogName);
      return res.send(updatedCatalog);
    }

    if (body.hasOwnProperty('chatId')) {
      if (isRemoved) {
        const updatedCatalog = await removeChatFromCatalog(catalogId, userId, chatId);
        return res.send(updatedCatalog);
      }
      const updatedCatalog = await addNewChatToCatalog(catalogId, userId, chatId);
      return res.send(updatedCatalog);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    await Catalog.remove(
      { _id: req.params.catalogId, userId: req.tokenData.userId });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await Catalog.aggregate([
      { $match: { userId: req.tokenData.userId } },
      {
        $project: {
          _id: 1,
          catalogName: 1,
          chats: 1
        }
      }
    ]);
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};
