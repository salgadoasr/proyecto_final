'use strict';

const express = require('express');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const getSkeins = require('../controllers/user/get-skeins');
const getSkein = require('../controllers/user/get-skein');
const getKits = require('../controllers/user/get-kits');
const getKit = require('../controllers/user/get-kit');
const createOrder = require('../controllers/user/create-order');
const getOrders = require('../controllers/user/get-orders');
const updateOrder = require('../controllers/user/update-order');


const userRouter = express.Router();

userRouter.get('/user/skeins', getSkeins);
userRouter.get('/user/skein', getSkein);
userRouter.get('/user/kits', getKits);
userRouter.get('/user/kit', getKit);
userRouter.post('/user/createorder', checkJwtToken, createOrder);
userRouter.get('/user/orders', checkJwtToken, getOrders);
userRouter.put('/user/payorder', checkJwtToken, updateOrder);


module.exports = userRouter;
