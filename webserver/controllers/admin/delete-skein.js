'use strict';

const mysqlPool = require('../../../databases/mysql-pool');


async function deleteSkeinFromDatabaseFromDatabase(uuid) {

  const connection = await mysqlPool.getConnection();

  await connection.query(`DELETE FROM skeins WHERE skein_uuid = '${uuid}'`);

  connection.release();
}

async function deleteSkeinFromDatabase(req, res, next) {
  const { uuid } = req.body;

  try {
    await deleteSkeinFromDatabaseFromDatabase(uuid);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = deleteSkeinFromDatabase;
