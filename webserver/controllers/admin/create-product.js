'use strict';

const Joi = require('joi');
const sendgridMail = require('@sendgrid/mail');
const uuidV4 = require('uuid/v4');

const mysqlPool = require('../../../databases/mysql-pool');


sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

// corregir cuando tenga la tabla bien definida
async function validateSchema(payload) {
  const schema = {
    name: Joi.string().min(3).max(255).required(),
    available: Joi.number().integer().min(0).max(1),
    specifications: Joi.string().max(1000),
    type_id: Joi.number().integer().min(1).max(20),
    image_url: Joi.string().min(3).max(255),
    prize: Joi.number().required(),
  };

  return Joi.validate(payload, schema);
}


async function insertProductIntoDatabase(uuid, name, available, specifications, typeId, imageUrl, prize) {

  const connection = await mysqlPool.getConnection();

  await connection.query('INSERT INTO products SET ?', {
    product_uuid: uuid,
    name,
    available,
    specifications,
    type_id: typeId,
    image_url: imageUrl,
    prize,
  });

  connection.release();
}

async function create(req, res, next) {
  const accountData = { ...req.body };
  const { image_url: imageUrl } = req.claims;

  try {
    await validateSchema(accountData);
  } catch (error) {
    return res.status(400).send(error.message);
  }

  // corregir cuando tenga la tabla bien definida
  const {
    name,
    available,
    specifications,
    type_id: typeId,
    prize,
  } = accountData;

  const uuid = uuidV4();

  try {
    await insertProductIntoDatabase(uuid, name, available, specifications, typeId, imageUrl, prize);

    return res.status(201).json(uuid);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = create;
