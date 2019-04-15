'use strict';

const mysqlPool = require('../../../databases/mysql-pool');


async function deleteProductFromDatabase(uuid) {

  const connection = await mysqlPool.getConnection();

  await connection.query(`DELETE FROM products WHERE product_uuid = '${uuid}'`);

  connection.release();
}

async function deleteProduct(req, res, next) {
  const { uuid } = req.body;

  try {
    await deleteProductFromDatabase(uuid);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = deleteProduct;
