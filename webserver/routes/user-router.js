'use strict';

const express = require('express');

const getProducts = require('../controllers/user/get-products');
const checkJwtToken = require('../controllers/session/check-jwt-token');


const userRouter = express.Router();

userRouter.get('/user/products', checkJwtToken, getProducts);

module.exports = userRouter;
