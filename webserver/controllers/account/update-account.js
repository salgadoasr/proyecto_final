'use strict';


const Joi = require('joi');

const mySqlPool = require('../../../databases/mysql-pool');

async function validateSchema(payload) {
  const schema = {
    name: Joi.string().min(3).max(150).required(),
    surnames: Joi.string().max(150).required(),
    direction: Joi.string().max(150).required(),
  };

  return Joi.validate(payload, schema);
}

async function updateAccount(req, res, next) {
  const accountData = { ...req.body };

  try {
    await validateSchema(accountData);
  } catch (error) {
    return res.status(400).send(error.message);
  }

  const {
    name,
    surnames,
    direction,
  } = accountData;

  const { uuid: userUuid } = req.claims;

  try {
    const connection = await mySqlPool.getConnection();

    await connection.query(`UPDATE users SET 
      name = '${name}',
      surnames = '${surnames}',
      direction = '${direction}'
    WHERE user_uuid ='${userUuid}'`);

    connection.release();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = updateAccount;
