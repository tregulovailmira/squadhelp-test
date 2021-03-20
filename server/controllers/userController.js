const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const bd = require('../models/index');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const moment = require('moment');
const uuid = require('uuid/v1');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');

module.exports.login = async (req, res, next) => {
  const { body: { email, password } } = req;
  try {
    const foundUser = await userQueries.findUser({ email });
    await userQueries.passwordCompare(password, foundUser.password);

    const accessToken = jwt.sign({
      firstName: foundUser.firstName,
      userId: foundUser.id,
      role: foundUser.role,
      lastName: foundUser.lastName,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
      rating: foundUser.rating
    }, CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });

    await userQueries.updateUser({ accessToken }, foundUser.id);

    return res.send({ token: accessToken });
  } catch (err) {
    next(err);
  }
};

module.exports.registration = async (req, res, next) => {
  const { body, hashPass } = req;
  try {
    const newUser = await userQueries.userCreation(
      Object.assign(body, { password: hashPass })
    );

    const accessToken = jwt.sign({
      firstName: newUser.firstName,
      userId: newUser.id,
      role: newUser.role,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      displayName: newUser.displayName,
      balance: newUser.balance,
      email: newUser.email,
      rating: newUser.rating
    }, CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME });

    await userQueries.updateUser({ accessToken }, newUser.id);

    return res.send({ token: accessToken });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail());
    } else {
      next(err);
    }
  }
};

const getCreateRatingQuery = (offerId, userId, mark, transaction) => ratingQueries.createRating({
  offerId,
  mark,
  userId
}, transaction);

const getUpdateRaringQuery = (offerId, userId, mark, transaction) => ratingQueries.updateRating({ mark },
  { offerId, userId }, transaction);

module.exports.changeMark = async (req, res, next) => {
  let sumOfRatings = 0;
  let rating = 0;
  let transaction;
  const {
    body: { isFirst, mark, creatorId },
    params: { offerId },
    tokenData: { userId }
  } = req;

  try {
    transaction = await bd.sequelize.transaction(
      { isolationLevel: bd.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED }
    );
    isFirst
      ? await getCreateRatingQuery(offerId, userId, mark, isFirst, transaction)
      : await getUpdateRaringQuery(offerId, userId, mark, isFirst, transaction);

    const offersArray = await bd.Ratings.findAll({
      include: [
        {
          model: bd.Offers,
          required: true,
          where: { userId: creatorId }
        }
      ],
      transaction
    });

    offersArray.forEach((offer) => { sumOfRatings += offer.dataValues.mark; });
    rating = sumOfRatings / offersArray.length;

    await userQueries.updateUser({ rating }, creatorId, transaction);
    await transaction.commit();

    controller.getNotificationController().emitChangeMark(creatorId);
    return res.send({ userId: creatorId, rating });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports.payment = async (req, res, next) => {
  const { body: { number, cvc, expiry, contests }, tokenData: { userId } } = req;
  let transaction;
  try {
    transaction = await bd.sequelize.transaction();
    await bankQueries.updateBankBalance({
      balance: bd.sequelize.literal(`CASE
          WHEN 
            "cardNumber"='${number.replace(/ /g, '')}' 
            AND "cvc"='${cvc}' 
            AND "expiry"='${expiry}'
          THEN "balance"-${CONSTANTS.CONTEST_PRICE}
          WHEN 
            "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' 
            AND "cvc"='${CONSTANTS.SQUADHELP_BANK_CVC}' 
            AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}'
          THEN "balance"+${CONSTANTS.CONTEST_PRICE} 
          END
        `)
    },
    {
      cardNumber: {
        [bd.sequelize.Op.in]: [
          CONSTANTS.SQUADHELP_BANK_NUMBER,
          number.replace(/ /g, '')
        ]
      }
    },
    transaction
    );

    const orderId = uuid();
    contests.forEach((contest, index) => {
      const prize = index === contests.length - 1
        ? Math.ceil(CONSTANTS.CONTEST_PRICE / contests.length)
        : Math.floor(CONSTANTS.CONTEST_PRICE / contests.length);
      contest = Object.assign(contest, {
        status: index === 0 ? 'active' : 'pending',
        userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize
      });
    });

    await bd.Contests.bulkCreate(contests, transaction);
    await transaction.commit();
    return res.send();
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { body, tokenData: { userId } } = req;
  try {
    if (req.file) {
      const { file: { filename } } = req;
      req.body.avatar = filename;
    }

    const { firstName, lastName, displayName, avatar, email, balance, role, id } = await userQueries.updateUser(body, userId);
    return res.send({ firstName, lastName, displayName, avatar, email, balance, role, id });
  } catch (err) {
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  const { body: { sum, number, cvc, expiry }, tokenData: { userId } } = req;
  let transaction;
  try {
    transaction = await bd.sequelize.transaction();
    const updatedUser = await userQueries.updateUser({ balance: bd.sequelize.literal('balance - ' + sum) },
      userId,
      transaction
    );
    await bankQueries.updateBankBalance({
      balance: bd.sequelize.literal(`CASE 
          WHEN 
            "cardNumber"='${number.replace(/ /g, '')}' 
            AND "expiry"='${expiry}' 
            AND "cvc"='${cvc}'
          THEN "balance"+${sum}
          WHEN 
            "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' 
            AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}' 
            AND "cvc"='${CONSTANTS.SQUADHELP_BANK_CVC}'
          THEN "balance"-${sum}
          END
        `)
    },
    {
      cardNumber: {
        [bd.sequelize.Op.in]: [
          CONSTANTS.SQUADHELP_BANK_NUMBER,
          number.replace(/ /g, '')
        ]
      }
    },
    transaction
    );

    await transaction.commit();
    res.send({ balance: updatedUser.balance });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
