'use strict';

const mySqlPool = require('../../../databases/mysql-pool');

async function getKit(req, res, next) {
  const { kit_uuid: kitUuid } = req.query;
  try {
    const connection = await mySqlPool.getConnection();

    const sqlQuery = `SELECT * FROM kits k INNER JOIN sizes s ON k.size_id = s.size_id WHERE k.kit_uuid = '${kitUuid}'`;
    const sqlQuerySize = `SELECT * FROM sizes WHERE kit_uuid = '${kitUuid}'`;
    const [result] = await connection.query(sqlQuery);
    const [sizes] = await connection.query(sqlQuerySize);

    if (result.length > 0 && sizes.length > 0) {
      result[0].sizes = sizes;
      connection.release();
      return res.status(200).send(result[0]);
    }

    connection.release();
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }

}

module.exports = getKit;
