const { promisify } = require('util');
const fs = require('fs');

const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

module.exports.createDirIfNotExist = async (path) => {
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

module.exports.createFileIfNotExist = async (path) => {
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
