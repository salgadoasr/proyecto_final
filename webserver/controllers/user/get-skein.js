'use strict';

const mySqlPool = require('../../../databases/mysql-pool');


async function getSkein(req, res, next) {
  const { skein_uuid: skeinUuid } = req.query;

  try {
    const connection = await mySqlPool.getConnection();

    // corregir el select * cuando tenga la tabla bien definida
    const sqlQuery = `SELECT * FROM skeins WHERE skein_uuid ='${skeinUuid}'`;

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

module.exports = getSkein;
