'use strict';

const jwt = require('jsonwebtoken');

async function isAdmin(req, res, next) {
  const { authorization } = req.headers;

  const [prefix, token] = authorization.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.AUTH_JWT_SECRET);

    if (decoded.isAdmin === 1) {
      return next();
    }
    console.log(decoded.isAdmin);
    return res.status(401).send();
  } catch (error) {

    return res.status(500).send();
  }
}

module.exports = isAdmin;
