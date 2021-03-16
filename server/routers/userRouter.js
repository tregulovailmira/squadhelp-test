const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const upload = require('../utils/fileUpload');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');

const userRouter = Router();

userRouter.patch(
  '/',
  checkToken.checkToken,
  upload.uploadAvatar,
  userController.updateUser
);

userRouter.get(
  '/contests',
  checkToken.checkToken,
  basicMiddlewares.convertingQueryParams,
  contestController.getCustomersContests,
);

userRouter.post(
  '/cashout',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  userController.cashout,
);

module.exports = userRouter;
