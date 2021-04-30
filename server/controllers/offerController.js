const ServerError = require('../errors/ServerError');
const offerQueries = require('./queries/offerQueries');
const controller = require('../socketInit');
const { sendEmail } = require('../utils/functions');
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
    if (moderationStatus === CONSTANTS.MODERATION_OFFER_STATUS_APPROVE) {
      controller.getNotificationController().emitEntryCreated(customerId);
      controller.getNotificationController().emitChangeOfferStatus(creatorId,
        'Someone of yours offers was appove by moderator', contestId);

      const textForCustomer = `You have new offer on contest №${contestId}`;
      const htlmBodyForCustomer = `
        <div>
          You have new offer on 
          <a href=${CONSTANTS.BASE_URL}/contest/${contestId}>
            contest №${contestId}
          </a>
        </div>`;
      await sendEmail(customerEmail, 'New offer', textForCustomer, htlmBodyForCustomer);
    } else {
      controller.getNotificationController().emitChangeOfferStatus(creatorId,
        'Someone of yours offers was decline by moderator', contestId);
    }

    const textForCustomer = `Your offer has been moderated! Status: ${moderationStatus}. Contest ID: ${contestId}`;
    const htmlBodyForCreator = `
      <div>
        Your offer has been moderated! Status: ${moderationStatus}. 
        <a href=${CONSTANTS.BASE_URL}/contest/${contestId}>
          Contest ID: ${contestId}
        </a>
      </div>`;
    await sendEmail(creatorEmail, 'Offer moderation', textForCustomer, htmlBodyForCreator);
    return res.status(200).send(updatedOffer);
  } catch (error) {
    next(new ServerError(error));
  }
};
