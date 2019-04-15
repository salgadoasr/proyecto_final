'use strict';

const mysqlPool = require('../../../databases/mysql-pool');

async function activate(req, res, next) {
  const { verification_code: verificationCode } = req.query;

  if (!verificationCode) {
    return res.status(400).json({
      message: 'invalid verification code',
      target: 'verification_code',
    });
  }

  const now = new Date();
  const sqlActivateQuery = `UPDATE users
  SET activated_at = '${now.toISOString().substring(0, 19).replace('T', ' ')}'
  WHERE verification_code='${verificationCode}'
  AND activated_at IS NULL`;

  try {
    const connection = await mysqlPool.getConnection();
    const result = await connection.query(sqlActivateQuery);

    if (result[0].affectedRows === 1) {
      connection.release();
      return res.send('Account activated');
    }

    connection.release();
    return res.send('Verification code invalid');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = activate;
