const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { Transform, pipeline } = require('stream');
const moment = require('moment');
const { createFileIfNotExist, createDirIfNotExist } = require('./fileAndDirCreating');
const { addDataToLogFile } = require('./logErrors');
const CONSTANTS = require('../../constants');

const pipelineAsync = promisify(pipeline);

const copyErrorsToDailyReport = async (mainReportPath, dailyReportPath) => {
  try {
    const transformStream = new Transform({ objectMode: true });
    transformStream._transform = function (data, encoding, callback) {
      const dailyErrors = JSON.parse(data);
      dailyErrors.forEach(error => delete error.stack);

      this.push(JSON.stringify(dailyErrors));
      callback();
    };

    await pipelineAsync(
      fs.createReadStream(mainReportPath),
      transformStream,
      fs.createWriteStream(dailyReportPath)
    );

    transformStream.end();
  } catch (error) {
    console.log(error);
    throw (error);
  }
};

module.exports.createDailyReport = async (logFilePath, logDirPath) => {
  try {
    const currentTimestamp = moment().subtract(1, 'day').endOf('day').format('DD-MM-YYYY HH:mm:ss');
    const dailyReportPath = path.resolve(CONSTANTS.LOG_DIR_NAME, `${currentTimestamp}.json`);

    await createDirIfNotExist(logDirPath);
    await createFileIfNotExist(logFilePath);
    await createFileIfNotExist(dailyReportPath);

    await copyErrorsToDailyReport(logFilePath, dailyReportPath);
    await addDataToLogFile(logFilePath, '[]', 0, 'w');
  } catch (error) {
    console.log(error);
    throw (error);
  }
};
