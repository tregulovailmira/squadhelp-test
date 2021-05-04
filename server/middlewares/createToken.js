const jwt = require('jsonwebtoken');
const TokenError = require('../errors/TokenError');
const CONSTANTS = require('../constants');

module.exports = (req, res, next) => {
  const { body: { email }, hashPass } = req;

  try {
    req.body.accessToken = jwt.sign({
      email,
      hashPass
    },
    CONSTANTS.JWT_SECRET,
    {
      expiresIn: CONSTANTS.ACCESS_TOKEN_TIME
    });

    next();
  } catch (error) {
    next(new TokenError(error.message));
  }
};
