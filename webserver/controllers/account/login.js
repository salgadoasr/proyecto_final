'use strict';

const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mysqlPool = require('../../../databases/mysql-pool');

async function validateData(payload) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  };

  return Joi.validate(payload, schema);
}

async function login(req, res, next) {
  const accountData = { ...req.body };

  try {
    await validateData(accountData);
  } catch (error) {
    return res.status(400).send(error.message);
  }

  try {
    const connection = await mysqlPool.getConnection();

    const sqlQuery = `SELECT *
    FROM users
    WHERE email = '${accountData.email}'`;

    const [result] = await connection.query(sqlQuery);

    if (result.length === 1) {
      const userData = result[0];

      if (!userData.activated_at) {
        connection.release();
        return res.status(403).send();
      }

      const checkPassword = await bcrypt.compare(accountData.password, userData.password);

      if (checkPassword === false) {
        connection.release();
        return res.status(401).send();
      }

      const payloadJwt = {
        uuid: userData.user_uuid,
        isAdmin: userData.is_admin,
      };

      const jwtTokenExpiration = parseInt(process.env.AUTH_ACCESS_TOKEN_TTL, 10);
      const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_SECRET, { expiresIn: jwtTokenExpiration });

      const response = {
        accessToken: token,
        expiresIn: jwtTokenExpiration,
        user: userData,
      };

      connection.release();
      return res.status(200).json(response);
    }

    connection.release();
    return res.status(404).send();
  } catch (error) {

    return res.status(500).send(error.message);
  }
}

module.exports = login;
