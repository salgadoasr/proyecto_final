'use strict';

const express = require('express');
const multer = require('multer');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const checkIsAdmin = require('../controllers/admin/check-is-admin');
const createColor = require('../controllers/admin/create-color');
const createSkein = require('../controllers/admin/create-skein');
const deleteSkein = require('../controllers/admin/delete-skein');

const upload = multer();
const adminRouter = express.Router();

adminRouter.post('/admin/skein', checkJwtToken, checkIsAdmin, createSkein);
adminRouter.post('/admin/createcolor', checkJwtToken, checkIsAdmin, upload.single('skein'), createColor);
adminRouter.post('/admin/deleteskein', checkJwtToken, checkIsAdmin, deleteSkein);


module.exports = adminRouter;
