const { Router } = require('express');
const validators = require('../middlewares/validators');
const hashPass = require('../middlewares/hashPassMiddle');
const createToken = require('../middlewares/createToken');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userController = require('../controllers/userController');

const authRouter = Router();

authRouter.post(
  '/login',
  validators.validateLogin,
  userController.login
);

authRouter.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration
);

authRouter.get(
  '/authUser',
  checkToken.checkAuth
);

authRouter
  .route('/password/forgot')
  .post(
    validators.validateRestorePasswordData,
    basicMiddlewares.checkUserByEmail,
    hashPass,
    createToken,
    userController.sendTokenForRestorePassword
  )
  .patch(
    checkToken.checkRestorePasswordToken,
    userController.updateLostPassword
  );

module.exports = authRouter;
