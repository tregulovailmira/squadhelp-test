const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const chatController = require('../controllers/chatController');

const chatRouter = Router();

chatRouter.get(
  '/preview',
  checkToken.checkToken,
  chatController.getPreview
);

chatRouter.post(
  '/messages',
  checkToken.checkToken,
  chatController.addMessage
);

chatRouter
  .route('/conversations/:interlocutorId')
  .get(
    checkToken.checkToken,
    chatController.getChat
  )
  .patch(
    checkToken.checkToken,
    chatController.toggleBlackAndFavoriteList
  );

chatRouter
  .route('/catalogs')
  .post(
    checkToken.checkToken,
    chatController.createCatalog
  )
  .get(
    checkToken.checkToken,
    chatController.getCatalogs
  );

chatRouter
  .route('/catalogs/:catalogId')
  .patch(
    checkToken.checkToken,
    chatController.updateCatalog
  )
  .delete(
    checkToken.checkToken,
    chatController.deleteCatalog
  );

module.exports = chatRouter;
