'use strict';

const mysqlPool = require('../../../databases/mysql-pool');


async function deleteKit(req, res, next) {
  const { kit_uuid: kitUuid } = req.query;

  try {
    const connection = await mysqlPool.getConnection();
    await connection.query(`DELETE FROM kits WHERE kit_uuid = '${kitUuid}'`);
    connection.release();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = deleteKit;
