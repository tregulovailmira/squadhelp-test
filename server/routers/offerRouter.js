const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userController = require('../controllers/userController');

const offerRouter = Router();

offerRouter.put(
  '/:offerId/rating',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  userController.changeMark,
);

module.exports = offerRouter;
