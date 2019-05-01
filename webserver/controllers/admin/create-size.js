'use strict';

const Joi = require('joi');
const sendgridMail = require('@sendgrid/mail');

const mysqlPool = require('../../../databases/mysql-pool');


sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

// corregir cuando tenga la tabla bien definida
async function validateSchema(payload) {
  const schema = {
    size: Joi.string().min(1).max(255).required(),
    prize: Joi.number().required(),
    kit_uuid: Joi.string().min(3).max(255).required(),
    num_skeins: Joi.number().required(),
  };

  return Joi.validate(payload, schema);
}

async function create(req, res, next) {
  const kitData = { ...req.body };

  try {
    await validateSchema(kitData);
  } catch (error) {
    return res.status(400).send(error.message);
  }

  const {
    size,
    kit_uuid: kitUuid,
    prize,
    num_skeins: numSkeins,
  } = kitData;

  try {
    const connection = await mysqlPool.getConnection();
    await connection.query(`INSERT INTO sizes SET kit_uuid = '${kitUuid}', size = '${size}', prize = '${prize}', num_skeins = '${numSkeins}'`);

    connection.release();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = create;
