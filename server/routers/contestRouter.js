const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');

const contestRouter = Router();

contestRouter.post(
  '/payment',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userController.payment,
);

contestRouter.get(
  '/data',
  checkToken.checkToken,
  contestController.dataForContest,
);

contestRouter
  .get(
    '/',
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    basicMiddlewares.convertingQueryParams,
    contestController.getContests,
  );

contestRouter
  .route('/:contestId')
  .get(
    checkToken.checkToken,
    basicMiddlewares.canGetContest,
    contestController.getContestById,
  )
  .put(
    checkToken.checkToken,
    upload.updateContestFile,
    contestController.updateContest,
  );


contestRouter.get(
  '/files/:fileName',
  checkToken.checkToken,
  contestController.downloadFile,
);

contestRouter.post(
  '/:contestId/offers',
  checkToken.checkToken,
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer,
);

contestRouter.put(
  '/:contestId/offers/:offerId',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  contestController.setOfferStatus,
);

module.exports = contestRouter;
