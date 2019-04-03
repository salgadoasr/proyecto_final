'use strict';

const webServer = require('./webserver');
const httpServerConfig = require('./config/http-server-config');
const mysqlPool = require('./databases/mysql-pool');


(async function initApp() {
  try {
    await mysqlPool.connect();
    await webServer.listen(httpServerConfig.port);
    console.log(`Server running at: ${httpServerConfig.port}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}());
