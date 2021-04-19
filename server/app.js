const express = require('express');
const cors = require('cors');
const handlerError = require('./handlerError/handler');
const router = require('./router');
const { reportTimer } = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use('/api', router);
app.use(handlerError);

reportTimer();

module.exports = app;
