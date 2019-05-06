'use strict';

const uuidV4 = require('uuid/v4');

const mySqlPool = require('../../../databases/mysql-pool');

async function createOrder(req, res, next) {
  const { products } = req.body;

  const now = new Date();
  const purchaseAT = now.toISOString().substring(0, 19).replace('T', ' ');
  const uuid = uuidV4();
  const { uuid: userUuid } = req.claims;

  try {
    const connection = await mySqlPool.getConnection();

    const [userEmail] = await connection.query(`SELECT email FROM users WHERE user_uuid = '${userUuid}'`);

    for (let i = 0; i < products.length; i++) {
      if (products[i].color) {
        // eslint-disable-next-line no-await-in-loop
        await connection.query('INSERT INTO orders SET ?', {
          order_uuid: uuid,
          user_uuid: userUuid,
          purchase_at: purchaseAT,
          user_email: userEmail[0].email,
          product_uuid: products[i].skeinUuid,
          quantity: products[i].quantity,
          total_prize: products[i].totalPrize,
          color: products[i].color,
          image_url: products[i].imageUrl,
          product_name: products[i].name,
        });
      } else {
        // eslint-disable-next-line no-await-in-loop
        await connection.query('INSERT INTO orders SET ?', {
          order_uuid: uuid,
          user_uuid: userUuid,
          purchase_at: purchaseAT,
          user_email: userEmail[0].email,
          product_uuid: products[i].kitUuid,
          quantity: products[i].quantity,
          total_prize: products[i].totalPrize,
          size: products[i].size,
          image_url: products[i].imageUrl,
          product_name: products[i].name,
        });
      }
    }


    connection.release();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}


module.exports = createOrder;
