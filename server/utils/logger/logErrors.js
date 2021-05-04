const { promisify } = require('util');
const fs = require('fs');

const stat = promisify(fs.stat);

module.exports.createObjectForLogging = (error) => {
  return {
    time: Date.now(),
    message: error.message || 'Server error',
    code: error.code || 500,
    stackTrace: error.stack || {}
  };
};

module.exports.getFileSize = async (filePath) => {
  try {
    const file = await stat(filePath);
    return file.size;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.addDataToLogFile = async (filePath, data, start, flags) => {
  try {
    const logStream = await fs.createWriteStream(filePath, { flags, start });
    await logStream.write(data, 'utf-8');
    logStream.end();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
