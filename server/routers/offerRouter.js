const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userController = require('../controllers/userController');
const offerController = require('../controllers/offerController');

const offerRouter = Router();

offerRouter.put(
  '/:offerId/rating',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  userController.changeMark
);

offerRouter
  .get(
    '/',
    checkToken.checkToken,
    basicMiddlewares.onlyForModerator,
    basicMiddlewares.convertingQueryParams,
    offerController.getUnmoderatedOffers
  );

offerRouter
  .patch(
    '/:offerId',
    checkToken.checkToken,
    basicMiddlewares.onlyForModerator,
    basicMiddlewares.findUserEmailById,
    offerController.moderateOffer
  );

module.exports = offerRouter;
