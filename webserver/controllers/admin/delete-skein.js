'use strict';

const mysqlPool = require('../../../databases/mysql-pool');


async function deleteSkein(req, res, next) {
  const { skein_uuid: skeinUuid } = req.query;

  try {
    const connection = await mysqlPool.getConnection();
    await connection.query(`DELETE FROM skeins WHERE skein_uuid = '${skeinUuid}'`);
    connection.release();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = deleteSkein;
