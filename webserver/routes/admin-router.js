'use strict';

const express = require('express');
const multer = require('multer');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const checkIsAdmin = require('../controllers/admin/check-is-admin');
const createColor = require('../controllers/admin/create-color');
const createSkein = require('../controllers/admin/create-skein');
const getSkeins = require('../controllers/admin/get-skeins');
const createKit = require('../controllers/admin/create-kit');
const getKits = require('../controllers/admin/get-kits');
const createSize = require('../controllers/admin/create-size');
const deleteSkein = require('../controllers/admin/delete-skein');
const deleteKit = require('../controllers/admin/delete-kit');
const getOrders = require('../controllers/admin/get-orders');

const upload = multer();
const adminRouter = express.Router();

adminRouter.post('/admin/createskein', checkJwtToken, checkIsAdmin, createSkein);
adminRouter.post('/admin/createcolor', checkJwtToken, checkIsAdmin, upload.single('file'), createColor);
adminRouter.get('/admin/skeins', checkJwtToken, checkIsAdmin, getSkeins);
adminRouter.get('/admin/kits', checkJwtToken, checkIsAdmin, getKits);
adminRouter.post('/admin/createkit', checkJwtToken, checkIsAdmin, upload.single('file'), createKit);
adminRouter.post('/admin/createsize', checkJwtToken, checkIsAdmin, createSize);
adminRouter.delete('/admin/deleteskein', checkJwtToken, checkIsAdmin, deleteSkein);
adminRouter.delete('/admin/deletekit', checkJwtToken, checkIsAdmin, deleteKit);
adminRouter.get('/admin/orders', checkJwtToken, getOrders);


module.exports = adminRouter;
