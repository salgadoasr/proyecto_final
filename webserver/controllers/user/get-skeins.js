'use strict';

const mySqlPool = require('../../../databases/mysql-pool');


async function getSkeins(req, res, next) {
  const { season } = req.query;

  try {
    const connection = await mySqlPool.getConnection();

    if (season === undefined) {

      const sqlQuery = 'SELECT * FROM skeins s INNER JOIN colors c ON s.color_id = c.color_id ORDER BY s.season';
      const [result] = await connection.query(sqlQuery);

      if (result.length > 0) {
        connection.release();
        return res.status(200).send(result);
      }
    } else {

      const sqlQuery = `SELECT *
      FROM skeins
      WHERE season ='${season}'`;

      const [result] = await connection.query(sqlQuery);

      if (result.length > 0) {
        connection.release();
        return res.status(200).send(result);
      }
    }

    connection.release();
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = getSkeins;
