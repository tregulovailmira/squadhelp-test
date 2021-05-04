const ServerError = require('../errors/ServerError');
const offerQueries = require('./queries/offerQueries');
const controller = require('../socketInit');
const { sendEmail, createModerationOfferMessages } = require('../utils/functions');
const CONSTANTS = require('../constants');

module.exports.getUnmoderatedOffers = async (req, res, next) => {
  const { query: { limit, offset } } = req;

  try {
    const unmoderatedOffers = await offerQueries.getUnmoderatedOffers(limit, offset);

    let haveMore = true;
    if (unmoderatedOffers.length < limit) {
      haveMore = false;
    }

    return res.status(200).send({ data: unmoderatedOffers, haveMore });
  } catch (error) {
    next(new ServerError(error));
  }
};

module.exports.moderateOffer = async (req, res, next) => {
  const {
    params: { offerId },
    body: { moderationStatus, customerEmail, creatorEmail, customerId, creatorId, contestId }
  } = req;
  try {
    const updatedOffer = await offerQueries.setModerationOfferStatus(moderationStatus, offerId);
    const { customerMessage, creatorMessage } = createModerationOfferMessages(contestId, moderationStatus);

    if (moderationStatus === CONSTANTS.MODERATION_OFFER_STATUS_APPROVE) {
      controller.getNotificationController().emitEntryCreated(customerId);

      await sendEmail(customerEmail, 'New offer', customerMessage[0], customerMessage[1]);
    }

    controller.getNotificationController().emitChangeOfferStatus(creatorId,
      `Someone of yours offers was moderated. Status: ${moderationStatus}`, contestId);

    await sendEmail(creatorEmail, 'Offer moderation', creatorMessage[0], creatorMessage[1]);

    return res.status(200).send(updatedOffer);
  } catch (error) {
    next(new ServerError(error));
  }
};
