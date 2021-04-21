require('dotenv').config();
const Mailgun = require('mailgun-js');
const bd = require('../models/index');
const CONSTANTS = require('../constants');

module.exports.createWhereForAllContests = (
  typeIndex, contestId, industry, awardSort) => {
  const object = {
    where: {},
    order: []
  };
  if (typeIndex) {
    Object.assign(object.where, { contestType: getPredicateTypes(typeIndex) });
  }
  if (contestId) {
    Object.assign(object.where, { id: contestId });
  }
  if (industry) {
    Object.assign(object.where, { industry: industry });
  }
  if (awardSort) {
    object.order.push(['prize', awardSort]);
  }
  Object.assign(object.where, {
    status: {
      [bd.Sequelize.Op.or]: [
        CONSTANTS.CONTEST_STATUS_FINISHED,
        CONSTANTS.CONTEST_STATUS_ACTIVE
      ]
    }
  });
  object.order.push(['id', 'desc']);
  return object;
};

function getPredicateTypes (index) {
  return { [bd.Sequelize.Op.or]: [types[index].split(',')] };
}

const types = [
  '',
  'name,tagline,logo',
  'name',
  'tagline',
  'logo',
  'name,tagline',
  'logo,tagline',
  'name,logo'
];

module.exports.sendEmail = async (email, subject, text, html) => {
  try {
    const apiKey = process.env.MAILGUN_KEY;
    const domain = process.env.MAILGUN_DOMAIN;

    const transporter = new Mailgun({ apiKey, domain });

    const mailOptions = {
      from: '"Squadhelp" <squadhelp@example.com>',
      to: email,
      subject,
      text,
      html
    };

    await transporter.messages().send(mailOptions);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
