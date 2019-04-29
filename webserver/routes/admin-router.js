'use strict';

const express = require('express');
const multer = require('multer');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const checkIsAdmin = require('../controllers/admin/check-is-admin');
const createColor = require('../controllers/admin/create-color');
const createSkein = require('../controllers/admin/create-skein');
const deleteSkein = require('../controllers/admin/delete-skein');
const getSkeins = require('../controllers/admin/get-skeins');
const createKit = require('../controllers/admin/create-kit');
const getKits = require('../controllers/admin/get-kits');
const createSize = require('../controllers/admin/create-size');

const upload = multer();
const adminRouter = express.Router();

adminRouter.post('/admin/skein', checkJwtToken, checkIsAdmin, createSkein);
adminRouter.post('/admin/createcolor', checkJwtToken, checkIsAdmin, upload.single('file'), createColor);
adminRouter.post('/admin/deleteskein', checkJwtToken, checkIsAdmin, deleteSkein);
adminRouter.get('/admin/skeins', checkJwtToken, checkIsAdmin, getSkeins);
adminRouter.get('/admin/kits', checkJwtToken, checkIsAdmin, getKits);
adminRouter.post('/admin/createkit', checkJwtToken, checkIsAdmin, upload.single('file'), createKit);
adminRouter.post('/admin/createsize', checkJwtToken, checkIsAdmin, createSize);


module.exports = adminRouter;
