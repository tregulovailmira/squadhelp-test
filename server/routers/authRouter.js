const { Router } = require('express');
const validators = require('../middlewares/validators');
const hashPass = require('../middlewares/hashPassMiddle');
const checkToken = require('../middlewares/checkToken');
const userController = require('../controllers/userController');

const authRouter = Router();

authRouter.post(
  '/login',
  validators.validateLogin,
  userController.login,
);

authRouter.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration,
);

authRouter.get(
  '/authUser',
  checkToken.checkAuth,
);

module.exports = authRouter;
