'use strict';

const uuidV4 = require('uuid/v4');

const mySqlPool = require('../../../databases/mysql-pool');

async function createOrder(req, res, next) {
  const orderData = { ...req.body };

  const {
    product_uuid: productUuid,
    quantity,
  } = orderData;

  const now = new Date();
  const purchaseAT = now.toISOString().substring(0, 19).replace('T', ' ');
  const uuid = uuidV4();
  const { uuid: userUuid } = req.claims;

  try {
    const connection = await mySqlPool.getConnection();

    await connection.query('INSERT INTO orders SET ?', {
      quantity,
      order_uuid: uuid,
      user_uuid: userUuid,
      product_uuid: productUuid,
      purchase_at: purchaseAT,
    });

    connection.release();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}


module.exports = createOrder;
