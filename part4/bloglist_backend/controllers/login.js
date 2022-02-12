/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Router = require('express').Router();

const User = require('../models/user');
const config = require('../utils/config');

Router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User
    .findOne({ username });

  const passwordCheck = user === null
    ? false
    : await bcrypt
      .compare(password, user.password);

  if (!user || !passwordCheck) {
    res
      .status(401)
      .json({ error: 'Invalid username or password!' });
  } else {
    const userInfo = {
      username: user.username,
      id: user._id,
    };

    const token = jwt
      .sign(userInfo, config.SECRET, { expiresIn: 60 * 10 });

    res
      .status(200)
      .send({
        username: user.username,
        name: `${user.firstName} ${user.lastName}`,
        token,
      });
  }
});

module.exports = Router;
