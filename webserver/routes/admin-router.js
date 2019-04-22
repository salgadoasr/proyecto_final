'use strict';

const express = require('express');
const multer = require('multer');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const checkIsAdmin = require('../controllers/admin/check-is-admin');
const uploadSkeinImage = require('../controllers/admin/upload-skein-image');
const createSkein = require('../controllers/admin/create-skein');
const deleteSkein = require('../controllers/admin/delete-skein');

const upload = multer();
const adminRouter = express.Router();

adminRouter.post('/admin/skein', checkJwtToken, checkIsAdmin, createSkein);
adminRouter.post('/admin/uploadimage', checkJwtToken, checkIsAdmin, upload.single('skein'), uploadSkeinImage);
adminRouter.post('/admin/deleteskein', checkJwtToken, checkIsAdmin, deleteSkein);


module.exports = adminRouter;
