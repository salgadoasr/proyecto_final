'use strict';

const express = require('express');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const getSkeins = require('../controllers/user/get-skeins');
const createOrder = require('../controllers/user/create-order');
const getSkein = require('../controllers/user/get-skein');
const getKits = require('../controllers/user/get-kits');
const getKit = require('../controllers/user/get-kit');


const userRouter = express.Router();

userRouter.get('/user/skeins', getSkeins);
userRouter.get('/user/skein', getSkein);
userRouter.get('/user/kits', getKits);
userRouter.get('/user/kit', getKit);
userRouter.post('/user/createorder', checkJwtToken, createOrder);


module.exports = userRouter;
