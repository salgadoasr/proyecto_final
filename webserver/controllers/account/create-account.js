'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');
const sendgridMail = require('@sendgrid/mail');
const uuidV4 = require('uuid/v4');
const mysqlPool = require('../../../databases/mysql-pool');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);


async function validateSchema(payload) {
  const schema = {
    fullname: Joi.string().min(3).max(150).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  };

  return Joi.validate(payload, schema);
}


async function insertUserIntoDatabase(fullName, email, password) {
  const securePassword = await bcrypt.hash(password, 10);
  const uuid = uuidV4();
  const verificationCode = uuidV4();
  const now = new Date();
  const createdAt = now.toISOString().substring(0, 19).replace('T', ' ');

  const connection = await mysqlPool.getConnection();

  await connection.query('INSERT INTO users SET ?', {
    uuid,
    email,
    name: fullName,
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
    fullname,
    email,
    password,
  } = accountData;

  try {
    const verificationCode = await insertUserIntoDatabase(fullname, email, password);

    try {
      await sendEmailRegistration(email, verificationCode);
    } catch (error) {
      console.error('Sengrid error', error.message);
    }
  } catch (error) {
    next(error.message);
  }
  return res.status(204).json();
}

module.exports = create;
