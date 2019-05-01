'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');
const sendgridMail = require('@sendgrid/mail');
const uuidV4 = require('uuid/v4');

const mysqlPool = require('../../../databases/mysql-pool');


sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

// corregir cuando tenga la tabla bien definida
async function validateSchema(payload) {
  const schema = {
    name: Joi.string().min(3).max(150).required(),
    surnames: Joi.string().max(150).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    direction: Joi,
  };

  return Joi.validate(payload, schema);
}


async function insertUserIntoDatabase(name, surnames, email, password, direction) {
  const securePassword = await bcrypt.hash(password, 10);
  const uuid = uuidV4();
  const verificationCode = uuidV4();
  const now = new Date();
  const createdAt = now.toISOString().substring(0, 19).replace('T', ' ');

  const connection = await mysqlPool.getConnection();

  await connection.query('INSERT INTO users SET ?', {
    user_uuid: uuid,
    email,
    name,
    surnames,
    direction,
    password: securePassword,
    created_at: createdAt,
    verification_code: verificationCode,
  });

  connection.release();

  return verificationCode;
}


async function sendEmailRegistration(userEmail, verificationCode) {
  const msg = {
    to: userEmail,
    from: {
      email: 'kits4knitters@yopmail.com',
      name: 'Kits4knitters :)',
    },
    subject: 'Welcome to Kits4knitters',
    text: 'Start to knit with us',
    html: `To confirm the account <a href="${process.env.HTTP_SERVER_DOMAIN}/api/account/activate?verification_code=${verificationCode}">activate it here</a>`,
  };

  const data = await sendgridMail.send(msg);

  return data;
}

async function create(req, res, next) {
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

  try {
    const verificationCode = await insertUserIntoDatabase(name, surnames, email, password, direction);

    try {
      await sendEmailRegistration(email, verificationCode);
    } catch (error) {
      console.error('Sengrid error', error.message);
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send();
  }
}

module.exports = create;
