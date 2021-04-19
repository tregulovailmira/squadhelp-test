const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { Transform, pipeline } = require('stream');
const moment = require('moment');
const { createFileIfNotExist } = require('./fileAndDirCreating');
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

module.exports.createDailyReport = async (logFilePath) => {
  try {
    const dailyReportPath = path.resolve(CONSTANTS.LOG_DIR_NAME, `${moment().format('DD-MM-YYYY HH:mm:ss')}.json`);
    await createFileIfNotExist(dailyReportPath);
    await copyErrorsToDailyReport(logFilePath, dailyReportPath);
    await addDataToLogFile(logFilePath, '[]', 0, 'w');
  } catch (error) {
    console.log(error);
    throw (error);
  }
};
