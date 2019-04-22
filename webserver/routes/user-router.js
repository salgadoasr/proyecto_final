'use strict';

const express = require('express');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const getSkeins = require('../controllers/user/get-skeins');
const getSkeinColors = require('../controllers/user/get-skein-colors');
const createOrder = require('../controllers/user/create-order');


const userRouter = express.Router();

userRouter.get('/user/skeins', getSkeins);
userRouter.get('/user/skeincolors', getSkeinColors);
userRouter.post('/user/createorder', checkJwtToken, createOrder);


module.exports = userRouter;
