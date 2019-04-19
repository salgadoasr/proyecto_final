'use strict';

const express = require('express');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const getProducts = require('../controllers/user/get-products');
const createOrder = require('../controllers/user/create-order');


const userRouter = express.Router();

userRouter.get('/user/products', getProducts);
userRouter.post('/user/createorder', checkJwtToken, createOrder);

module.exports = userRouter;
