const path = require('path');
const moment = require('moment');
const { createDirIfNotExist, createFileIfNotExist } = require('./fileAndDirCreating');
const { createObjectForLogging, getFileSize, addDataToLogFile } = require('./logErrors');
const { createDailyReport } = require('./dailyErrorsReport');
const CONSTANTS = require('../../constants');

const logDirPath = path.resolve(CONSTANTS.LOG_DIR_NAME);
const logFilePath = path.resolve(CONSTANTS.LOG_DIR_NAME, CONSTANTS.LOG_FILE_NAME);

module.exports.logErrorToFile = async (error) => {
  await createDirIfNotExist(logDirPath);
  await createFileIfNotExist(logFilePath);

  const preparedError = JSON.stringify(createObjectForLogging(error));
  const fileSize = await getFileSize(logFilePath);
  const start = fileSize - 1;

  const dataForLog = fileSize > 2
    ? `, ${preparedError}]`
    : `${preparedError}]`;

  await addDataToLogFile(logFilePath, dataForLog, start, 'r+');
};

module.exports.reportTimer = () => {
  const startTime = moment().add(1, 'day').startOf('day');

  const wait = startTime.diff(moment());

  setTimeout(() => {
    createDailyReport(logFilePath);
    setInterval(() => {
      createDailyReport(logFilePath);
    }, CONSTANTS.DAY_LENGTH);
  }, wait);
};
