const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);
const stat = promisify(fs.stat);

const logDirPath = path.resolve('log');
const logFilePath = path.resolve('log', 'log.json');

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
