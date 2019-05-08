'use strict';

const mySqlPool = require('../../../databases/mysql-pool');

function addProductToArray(result, productsInOrder, cont) {
  const { image_url, product_name, quantity, paid } = result[cont];

  if (result[cont].color) {
    const { color } = result[cont];
    const product = { color, image_url, product_name, quantity, paid };
    productsInOrder.push(product);

  } else {
    const { size } = result[cont];
    const product = { size, image_url, product_name, quantity, paid };
    productsInOrder.push(product);
  }
}

async function getOrders(req, res, next) {
  const { uuid: userUuid } = req.claims;
  try {
    const connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT * FROM orders WHERE user_uuid = '${userUuid}' ORDER BY purchase_at DESC, order_uuid`;
    const [result] = await connection.query(sqlQuery);

    if (result.length > 0) {
      const order = [];
      const productsInOrder = [];
      let orderUuid = result[0].order_uuid;

      for (let i = 0; i < result.length; i++) {
        if (result[i].order_uuid === orderUuid) {
          result[i].purchase_at = result[i].purchase_at.toISOString().substring(0, 19).replace('T', ' ');
          addProductToArray(result, productsInOrder, i);
          result[i].products = productsInOrder.slice();

        } else {
          orderUuid = result[i].order_uuid;
          productsInOrder.length = 0;
          result[i].purchase_at = result[i].purchase_at.toISOString().substring(0, 19).replace('T', ' ');
          order.push(result[i - 1]);
          addProductToArray(result, productsInOrder, i);
          result[i].products = productsInOrder.slice();
        }
      }
      order.push(result[result.length - 1]);
      connection.release();
      return res.status(200).send(order);
    }
    connection.release();
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = getOrders;
