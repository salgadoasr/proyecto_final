'use strict';


const bcrypt = require('bcrypt');
const Joi = require('joi');

const mySqlPool = require('../../../databases/mysql-pool');


// corregir cuando tenga la tabla bien definida
async function validateSchema(payload) {
  const schema = {
    name: Joi.string().min(3).max(150).required(),
    surnames: Joi.string().max(150),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    direction: Joi.string().max(150),
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
    email,
    password,
    direction,
  } = accountData;

  const securePassword = await bcrypt.hash(password, 10);
  const { uuid: userUuid } = req.claims;

  const fullName = `${name} ${surnames}`;

  try {
    const connection = await mySqlPool.getConnection();

    await connection.query(`UPDATE users SET 
      name = '${fullName}',
      email = '${email}',
      password = '${securePassword}',
      direction = '${direction}'
    WHERE user_uuid ='${userUuid}'`);

    connection.release();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = updateAccount;
