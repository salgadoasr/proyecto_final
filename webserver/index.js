'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');


const app = express();
let server = null;

app.use(bodyParser.json());


app.use((req, res, next) => {
  const accessControlAllowMethods = [
    // fill the methods
  ];

  const accessControlAllowHeaders = [
    // fill the headers
  ];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  // Access-Control-Allow-Methods: put accessControlAllowHeaders separated by comma
  res.header('Access-Control-Allow-Methods', accessControlAllowMethods.join(','));
  // put accessControlAllowHeaders separated by comma
  res.header('Access-Control-Allow-Headers', accessControlAllowHeaders.join(','));
  next();
});

app.use('/api', routes.accountRouter);
app.use('/api', routes.userRouter);

async function listen(port) {
  if (server === null) {
    server = await app.listen(port);
  } else {
    console.error("Can't listen, server already initialized");
  }
}

async function close() {
  if (server) {
    await server.close();
    server = null;
  } else {
    console.error("Can't close a non started server");
  }
}

module.exports = {
  listen,
  close,
};
