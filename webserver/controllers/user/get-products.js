'use strict';

const Joi = require('joi');

const mySqlPool = require('../../../databases/mysql-pool');


async function getProducts(req, res, next) {
  const typeProduct = { ...req.body };

  try {
    const connection = await mySqlPool.getConnection();

    const sqlQuery = `SELECT id, uuid, name, available, specifications
    FROM product
    WHERE type_id ='${typeProduct.type_id}'`;

    const [result] = await connection.query(sqlQuery);

    if (result.length > 0) {
      connection.release();
      return res.status(200).send(result);
    }

    connection.release();
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = getProducts;
