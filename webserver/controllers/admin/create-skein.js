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
    description: Joi.string().max(1000).required(),
    type_id: Joi.number().integer().min(1).max(20).required(),
    prize: Joi.number().required(),
    composition: Joi.string().max(1000).required(),
    weight: Joi.string().min(3).max(255).required(),
    large: Joi.string().min(3).max(255).required(),
    color_id: Joi.number().integer().min(1).max(20).required(),
  };

  return Joi.validate(payload, schema);
}


async function insertSkeinIntoDatabase(uuid, name, description, typeId, prize, composition, weight, large, colorId) {

  const connection = await mysqlPool.getConnection();

  await connection.query('INSERT INTO skeins SET ?', {
    skein_uuid: uuid,
    name,
    description,
    type_id: typeId,
    prize,
    composition,
    weight,
    large,
    color_id: colorId,
  });

  connection.release();
}

async function create(req, res, next) {
  const accountData = { ...req.body };

  try {
    await validateSchema(accountData);
  } catch (error) {
    return res.status(400).send(error.message);
  }

  // corregir cuando tenga la tabla bien definida
  const {
    name,
    type_id: typeId,
    prize,
    composition,
    weight,
    large,
    color_id: colorId,
    description,
  } = accountData;

  const uuid = uuidV4();

  try {
    await insertSkeinIntoDatabase(uuid, name, description, typeId, prize, composition, weight, large, colorId);

    return res.status(201).json(uuid);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = create;
