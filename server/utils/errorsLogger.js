const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { Transform, pipeline } = require('stream');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);
const stat = promisify(fs.stat);
const pipelineAsync = promisify(pipeline);

const logDirPath = path.resolve('log');
const logFilePath = path.resolve('log', 'log.json');
const dailyReportPath = path.resolve('log', `${new Date()}.json`);

const createDirIfNotExist = async (path) => {
  try {
    await access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      await mkdir(path, { recursive: true });
      return true;
    } else {
      throw error;
    }
  }
};

const createFileIfNotExist = async (path) => {
  try {
    await access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeFile(path, '[]');
      return true;
    } else {
      throw error;
    }
  }
};

const createObjectForLogging = (error) => {
  return {
    time: Date.now(),
    message: error.message || 'Server error',
    code: error.code || 500,
    stackTrace: error.stack || {}
  };
};

const getFileSize = async (filePath) => {
  try {
    const file = await stat(filePath);
    return file.size;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addDataToLogFile = async (filePath, data, start, flags) => {
  try {
    const logStream = await fs.createWriteStream(filePath, { flags, start });
    await logStream.write(data, 'utf-8');
    logStream.end();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createObjectForDailyErrorsReport = async (mainReportPath, dailyReportPath) => {
  try {
    const transformStream = new Transform({ objectMode: true });
    transformStream._transform = function (data, encoding, callback) {
      const dailyErrors = JSON.parse(data);
      const preparedErrors = dailyErrors.map(({ time, code, message }) => {
        return { time, code, message };
      });

      this.push(JSON.stringify(preparedErrors));
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

module.exports.dailyErrorsReport = async () => {
  try {
    await createFileIfNotExist(dailyReportPath);
    await createObjectForDailyErrorsReport(logFilePath, dailyReportPath);
    await addDataToLogFile(logFilePath, '[]', 0, 'w');
  } catch (error) {
    console.log(error);
    throw (error);
  }
};
