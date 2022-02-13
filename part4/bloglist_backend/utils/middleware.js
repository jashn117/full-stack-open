const jwt = require('jsonwebtoken');

const logger = require('./logger');
const config = require('./config');
const User = require('../models/user');

const tokenExtractor = (req, res, next) => {
  const auth = req
    .get('authorization');

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7);
  } else {
    req.token = null;
  }

  next();
};

const extractUser = async (req, res, next) => {
  const decodedToken = jwt
    .verify(req.token, config.SECRET);

  if (!decodedToken.id) {
    req.user = null;
  } else {
    req.user = await User
      .findById(decodedToken.id);
  }

  next();
};

const unknownEndpoint = (req, res) => {
  logger.error(`Request to unknown endpoint ${req.path}`);

  res
    .status(400)
    .send({ error: 'Unknown endpoint!' });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError') {
    res
      .status(400)
      .send({ error: 'Invalid/Malformed ID' });
  } else if (err.name === 'ValidationError' || err.name === 'ValidatorError') {
    res
      .status(400)
      .json({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    res
      .status(401)
      .json({ error: 'Invalid token!' });
  } else if (err.name === 'TokenExpiredError') {
    res
      .status
      .json({ error: 'token expired! login again and retry.' });
  }

  next(err);
};

module.exports = {
  tokenExtractor,
  extractUser,
  unknownEndpoint,
  errorHandler,
};
