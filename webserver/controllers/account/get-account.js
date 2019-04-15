'use strict';

const mySqlPool = require('../../../databases/mysql-pool');


async function getProducts(req, res, next) {
  const { uuid } = req.claims;

  try {
    const connection = await mySqlPool.getConnection();

    // corregir el select * cuando tenga la tabla bien definida
    const sqlQuery = `SELECT * FROM users WHERE user_uuid = '${uuid}'`;

    const [result] = await connection.query(sqlQuery);

    connection.release();

    return res.status(200).send(result);
  } catch (error) {

    return res.status(500).send(error.message);
  }
}

module.exports = getProducts;
