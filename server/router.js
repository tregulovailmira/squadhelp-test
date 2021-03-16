const express = require('express');
const { authRouter, chatRouter, contestRouter, userRouter, offerRouter } = require('./routers');

const router = express.Router();

router.use('/auth', authRouter);

router.use('/chat', chatRouter);

router.use('/contests', contestRouter);

router.use('/user', userRouter);

router.use('/offers', offerRouter);

module.exports = router;
