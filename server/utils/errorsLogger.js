const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

const logDirPath = path.resolve('log');

const logFilePath = path.resolve('log', 'log.json');

const createDirIfNotExist = async (path) => {
  console.log('createDirIfNotExist');
  try {
    await access(path, fs.constants.F_OK);
    console.log('Directory exists');
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Directory does not exists');
      await mkdir(path, { recursive: true });
      console.log('Directory is created');
      return true;
    } else {
      console.log('Some other error: ', error);
      throw error;
    }
  }
};

const createFileIfNotExist = async (path) => {
  console.log('createFileIfNotExist');
  try {
    await access(path, fs.constants.F_OK);
    console.log('File exists');
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('File does not exists');
      await writeFile(path, 'Some log\n');
      console.log('File is created');
      return true;
    } else {
      console.log('Some other error: ', error);
      throw error;
    }
  }
};

module.exports.logErrorToFile = async (error) => {
  console.log('logErrorToFile');

  const isExistDir = await createDirIfNotExist(logDirPath);
  console.log('isExistDir', isExistDir);

  const isExistFile = await createFileIfNotExist(logFilePath);
  console.log('isExistFile', isExistFile);

  return error;
};
