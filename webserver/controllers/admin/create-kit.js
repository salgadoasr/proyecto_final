'use strict';

const cloudinary = require('cloudinary');
const uuidV4 = require('uuid/v4');

const mySqlPool = require('../../../databases/mysql-pool');

const cloudName = process.env.CLOUDINARI_CLOUD_NAME;
const apiKey = process.env.CLOUDINARI_API_KEY;
const apiSecret = process.env.CLOUDINARI_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

async function createKit(req, res, next) {
  const { file } = req;
  const { uuid: skein_uuid, name, details, type_id } = req.body;

  try {
    if (!file.buffer) {
      return res.status(400).send();
    }
    cloudinary.v2.uploader.upload_stream({
      resource_type: 'raw',
      //public_id: uuid,
      width: 200,
      height: 200,
      format: 'jpg',
      crop: 'limit',
    }, async (error, result) => {
      if (error) {
        return res.status(400).send(error);
      }

      const uuid = uuidV4();
      const {
        secure_url: secureUrl,
      } = result;

      const connection = await mySqlPool.getConnection();

      await connection.query(`INSERT INTO kits SET image_url = '${secureUrl}', kit_uuid = '${uuid}', skein_uuid = '${skein_uuid}', name = '${name}', details = '${details}', type_id = '${type_id}'`);

      connection.release();

      return res.status(204).send();
    }).end(file.buffer);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}


module.exports = createKit;
