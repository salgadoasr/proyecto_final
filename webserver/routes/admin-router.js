'use strict';

const express = require('express');
const multer = require('multer');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const checkIsAdmin = require('../controllers/admin/check-is-admin');
const uploadProductImage = require('../controllers/admin/upload-product-image');
const createProduct = require('../controllers/admin/create-product');
const deleteProduct = require('../controllers/admin/delete-product');

const upload = multer();
const adminRouter = express.Router();

adminRouter.post('/admin/product', checkJwtToken, checkIsAdmin, createProduct);
adminRouter.post('/admin/uploadimage', checkJwtToken, checkIsAdmin, upload.single('product'), uploadProductImage);
adminRouter.post('/admin/deleteproduct', checkJwtToken, checkIsAdmin, deleteProduct);


module.exports = adminRouter;
