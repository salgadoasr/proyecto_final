'use strict';

const Joi = require('joi');

const mySqlPool = require('../../../databases/mysql-pool');


async function getProducts(req, res, next) {
  const typeProduct = { ...req.body };

  try {
    const connection = await mySqlPool.getConnection();

    if (typeProduct.type_id === undefined) {

      // corregir el select * cuando tenga la tabla bien definida
      const sqlQuery = 'SELECT * FROM products';
      const [result] = await connection.query(sqlQuery);

      if (result.length > 0) {
        connection.release();
        return res.status(200).send(result);
      }
    } else {

      // corregir el select * cuando tenga la tabla bien definida
      const sqlQuery = `SELECT *
      FROM products
      WHERE type_id ='${typeProduct.type_id}'`;

      const [result] = await connection.query(sqlQuery);

      if (result.length > 0) {
        connection.release();
        return res.status(200).send(result);
      }
    }

    connection.release();
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = getProducts;
