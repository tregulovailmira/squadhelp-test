const { Offers, Users, Contests } = require('../../models');
const CONSTANTS = require('../../constants');
const ServerError = require('../../errors/ServerError');

module.exports.getUnmoderatedOffers = async (limit, offset) => {
  try {
    const foundOffers = await Offers.findAll({
      where: { moderationStatus: CONSTANTS.MODERATION_OFFER_STATUS_PENDING },
      include: [
        {
          model: Users,
          attributes: ['firstName', 'lastName', 'avatar', 'email', 'id'],
          required: true
        },
        {
          model: Contests,
          attributes: ['id', 'title', 'contestType', 'userId'],
          required: true
        }
      ],
      order: [['id', 'ASC']],
      limit,
      offset: offset || 0
    });
    return foundOffers.map(offer => offer.get({ plain: true }));
  } catch (error) {
    throw new ServerError(error);
  }
};

module.exports.setModerationOfferStatus = async (moderationStatus, id) => {
  try {
    const [updatedResult, updatedOffer] = await Offers.update({ moderationStatus },
      { where: { id }, returning: true });
    if (updatedResult < 1) {
      throw new ServerError('Cannot update offer');
    }
    console.log('updatedOffer', updatedOffer.dataValues);
    return updatedOffer.dataValues;
  } catch (error) {
    throw new ServerError(error);
  }
};
