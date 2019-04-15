'use strict';

const express = require('express');
const createAccount = require('../controllers/account/create-account');
const activateAccount = require('../controllers/account/activate-account');
const login = require('../controllers/account/login');
const updateAccount = require('../controllers/account/update-account');
const getAccount = require('../controllers/account/get-account');

const checkJwtToken = require('../controllers/session/check-jwt-token');

const accountRouter = express.Router();

accountRouter.post('/account', createAccount);
accountRouter.get('/account/activate', activateAccount);
accountRouter.post('/account/login', login);
accountRouter.post('/account/update', checkJwtToken, updateAccount);
accountRouter.get('/account/getaccount', checkJwtToken, getAccount);

module.exports = accountRouter;
