'use strict';

const mySqlPool = require('../../../databases/mysql-pool');

async function updateOrder(req, res, next) {
  const { orderUuid } = req.body;

  try {
    const connection = await mySqlPool.getConnection();

    const sqlQuery = `UPDATE orders
    SET paid = '1'
    WHERE order_uuid = '${orderUuid}'`;

    const result = await connection.query(sqlQuery);

    if (result[0].affectedRows >= 1) {
      connection.release();
      return res.status(204).send();
    }

    connection.release();
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = updateOrder;
