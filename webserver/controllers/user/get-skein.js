'use strict';

const mySqlPool = require('../../../databases/mysql-pool');


async function getSkein(req, res, next) {
  const { skein_uuid: skeinUuid } = req.query;
  try {
    const connection = await mySqlPool.getConnection();

    const sqlQuery = `SELECT * FROM skeins s INNER JOIN colors c ON s.color_id = c.color_id WHERE s.skein_uuid = '${skeinUuid}'`;
    const sqlQueryColor = `SELECT * FROM colors WHERE skein_uuid = '${skeinUuid}'`;
    const [result] = await connection.query(sqlQuery);
    const [colors] = await connection.query(sqlQueryColor);

    if (result.length > 0 && colors.length > 0) {
      result[0].colors = colors;
      connection.release();
      return res.status(200).send(result[0]);
    }
    connection.release();
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = getSkein;
