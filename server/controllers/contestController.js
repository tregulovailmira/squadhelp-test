const db = require('../models/index');
const _ = require('lodash');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants');

module.exports.dataForContest = async (req, res, next) => {
  const { query: { characteristic1, characteristic2 } } = req;
  const response = {};
  try {
    const characteristics = await db.Selects.findAll({
      where: {
        type: {
          [db.Sequelize.Op.or]: _.compact([
            characteristic1,
            characteristic2,
            'industry'
          ])
        }
      }
    });
    if (!characteristics) {
      return next(new ServerError());
    }
    characteristics.forEach(characteristic => {
      if (!response[characteristic.type]) {
        response[characteristic.type] = [];
      }
      response[characteristic.type].push(characteristic.describe);
    });
    return res.send(response);
  } catch (err) {
    next(new ServerError('cannot get contest preferences'));
  }
};

module.exports.getContestById = async (req, res, next) => {
  const {
    params: { contestId },
    tokenData: { role, userId }
  } = req;
  try {
    let contestInfo = await db.Contests.findOne({
      where: {
        id: contestId
      },
      order: [
        [db.Offers, 'id', 'asc']
      ],
      include: [
        {
          model: db.Users,
          required: true,
          attributes: {
            exclude: [
              'password',
              'role',
              'balance',
              'accessToken'
            ]
          }
        },
        {
          model: db.Offers,
          required: false,
          where: role === CONSTANTS.CREATOR
            ? { userId }
            : { moderationStatus: CONSTANTS.MODERATION_OFFER_STATUS_APPROVE },
          attributes: { exclude: ['userId', 'contestId'] },
          include: [
            {
              model: db.Users,
              required: true,
              attributes: {
                exclude: [
                  'password',
                  'role',
                  'balance',
                  'accessToken'
                ]
              }
            },
            {
              model: db.Ratings,
              required: false,
              where: { userId },
              attributes: { exclude: ['userId', 'offerId'] }
            }
          ]
        }
      ]
    });
    contestInfo = contestInfo.get({ plain: true });
    contestInfo.Offers.forEach(offer => {
      if (offer.Rating) {
        offer.mark = offer.Rating.mark;
      }
      delete offer.Rating;
    });
    return res.send(contestInfo);
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.downloadFile = async (req, res, next) => {
  const { params: { fileName } } = req;
  const file = CONSTANTS.CONTESTS_DEFAULT_DIR + fileName;
  return res.download(file);
};

module.exports.updateContest = async (req, res, next) => {
  const { body: { contestId }, tokenData: { userId } } = req;
  if (req.file) {
    const {
      file: { filename, originalname }
    } = req;

    req.body.fileName = filename;
    req.body.originalFileName = originalname;
  }

  try {
    const updatedContest = await contestQueries.updateContest(req.body, {
      id: contestId,
      userId
    });
    return res.send(updatedContest);
  } catch (e) {
    next(e);
  }
};

module.exports.setNewOffer = async (req, res, next) => {
  const {
    body: { contestType, offerData, contestId, customerId },
    tokenData,
    tokenData: { userId }
  } = req;

  const newOffer = {};

  if (contestType === CONSTANTS.LOGO_CONTEST) {
    const {
      file: { filename, originalname }
    } = req;
    newOffer.fileName = filename;
    newOffer.originalFileName = originalname;
  } else {
    newOffer.text = offerData;
  }

  newOffer.userId = userId;
  newOffer.contestId = contestId;

  try {
    const createdOffer = await contestQueries.createOffer(newOffer);
    delete createdOffer.contestId;
    delete createdOffer.userId;

    // controller.getNotificationController().emitEntryCreated(customerId);

    const User = Object.assign({}, tokenData, { id: userId });
    return res.send(Object.assign({}, createdOffer, { User }));
  } catch (e) {
    return next(new ServerError());
  }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejectedOffer = await contestQueries.updateOffer(
    { status: CONSTANTS.OFFER_STATUS_REJECTED }, { id: offerId }
  );
  controller.getNotificationController().emitChangeOfferStatus(creatorId,
    'Someone of yours offers was rejected', contestId);
  return rejectedOffer;
};

const resolveOffer = async (contestId, creatorId, orderId, offerId, priority, transaction) => {
  const finishedContest = await contestQueries.updateContestStatus({
    status: db.sequelize.literal(`CASE
            WHEN 
              "id"=${contestId}  
              AND "orderId"='${orderId}' 
            THEN '${CONSTANTS.CONTEST_STATUS_FINISHED}'
            WHEN 
              "orderId"='${orderId}' 
              AND "priority"=${Number(priority) + 1}  
            THEN '${CONSTANTS.CONTEST_STATUS_ACTIVE}'
            ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}'
            END
    `)
  }, { orderId }, transaction);

  await userQueries.updateUser({ balance: db.sequelize.literal('balance + ' + finishedContest.prize) },
    creatorId, transaction);
  const updatedOffers = await contestQueries.updateOfferStatus({
    status: db.sequelize.literal(`CASE
            WHEN 
              "id"=${offerId} 
            THEN '${CONSTANTS.OFFER_STATUS_WON}'
            ELSE '${CONSTANTS.OFFER_STATUS_REJECTED}'
            END
    `)
  }, { contestId }, transaction);

  transaction.commit();

  const arrayRoomsId = [];
  updatedOffers.forEach(offer => {
    if (offer.status === CONSTANTS.OFFER_STATUS_REJECTED && creatorId !== offer.userId) {
      arrayRoomsId.push(offer.userId);
    }
  });

  controller.getNotificationController().emitChangeOfferStatus(arrayRoomsId,
    'Someone of yours offers was rejected', contestId);
  controller.getNotificationController().emitChangeOfferStatus(creatorId,
    'Someone of your offers WIN', contestId);
  console.log('updatedOffers', updatedOffers);
  return updatedOffers[0].dataValues;
};

module.exports.setOfferStatus = async (req, res, next) => {
  const {
    params: { offerId, contestId },
    query: { command, creatorId, orderId, priority }
  } = req;

  let transaction;
  if (command === 'reject') {
    try {
      const offer = await rejectOffer(offerId, creatorId, contestId);
      res.send(offer);
    } catch (err) {
      next(err);
    }
  } else if (command === 'resolve') {
    try {
      transaction = await db.sequelize.transaction();
      const winningOffer = await resolveOffer(
        contestId,
        creatorId,
        orderId,
        offerId,
        priority,
        transaction
      );
      return res.send(winningOffer);
    } catch (err) {
      transaction.rollback();
      next(err);
    }
  }
};

module.exports.getCustomersContests = async (req, res, next) => {
  const {
    query: { limit, offset, status },
    tokenData: { userId }
  } = req;
  try {
    const contests = await db.Contests.findAll({
      where: { status, userId },
      limit,
      offset: offset || 0,
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Offers,
          required: false,
          attributes: ['id']
        }
      ]
    });

    contests.forEach(contest => {
      contest.dataValues.count = contest.dataValues.Offers.length;
    });

    let haveMore = true;
    if (contests.length < limit) {
      haveMore = false;
    }

    return res.send({ contests, haveMore });
  } catch (error) {
    next(new ServerError(error));
  }
};

module.exports.getContests = async (req, res, next) => {
  const {
    query: { contestId, industry, awardSort, typeIndex, limit, offset, ownEntries },
    tokenData: { userId }
  } = req;

  try {
    const predicates = UtilFunctions.createWhereForAllContests(typeIndex, contestId, industry, awardSort);
    const contests = await db.Contests.findAll({
      where: predicates.where,
      order: predicates.order,
      limit,
      offset: offset || 0,
      include: [
        {
          model: db.Offers,
          required: ownEntries,
          where: ownEntries ? { userId } : {},
          attributes: ['id']
        }
      ]
    });

    contests.forEach(contest => {
      contest.dataValues.count = contest.dataValues.Offers.length;
    });

    let haveMore = true;
    if (contests.length < limit) {
      haveMore = false;
    }

    return res.send({ contests, haveMore });
  } catch (error) {
    next(new ServerError(error));
  }
};
