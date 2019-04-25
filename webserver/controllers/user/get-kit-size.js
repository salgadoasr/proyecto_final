'use strict';

const mySqlPool = require('../../../databases/mysql-pool');

async function getKitSizes(req, res, next) {
  const { kit_uuid: kitUuid } = req.query;

  try {
    const connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT * FROM sizes WHERE kit_uuid = '${kitUuid}'`;
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

module.exports = getKitSizes;
