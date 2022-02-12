const Router = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const blog = require('../models/blog');

Router.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
    });

  res
    .json(users);
});

Router.get('/:id', async (req, res) => {
  const user = await User
    .findById(req.params.id)
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
    });

  if (user) {
    res
      .json(user);
  } else {
    res
      .status(404)
      .end();
  }
});

Router.post('/', async (req, res) => {
  const saltRounds = 10;

  const user = new User({
    ...req.body,
    password: await bcrypt
      .hash(req.body.password, saltRounds),
  });

  const result = await user
    .save();

  res
    .status(201)
    .json(result);
});

Router.put('/:id/create', async (req, res) => {
  const user = await User
    .findById(req.params.id);

  if (user) {
    const { blogID } = req.body;
    const userObj = user.toJSON();

    const updatedUser = {
      username: userObj.username,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      password: userObj.password,
      blogs: userObj.blogs.concat(blogID),
    };

    await User
      .findByIdAndUpdate(req.params.id, updatedUser, { new: true });

    res
      .status(200)
      .end();
  } else {
    res
      .status(204)
      .end();
  }
});

Router.put('/:id/changepasswd', async (req, res) => {
  const user = await User
    .findById(req.params.id);

  if (user) {
    const { password } = req.body;
    const userObj = user.toJSON();

    const saltRounds = 10;

    const updatedUser = {
      username: userObj.username,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      password: await bcrypt
        .hash(password, saltRounds),
      blogs: userObj.blogs,
    };

    await User
      .findByIdAndUpdate(req.params.id, updatedUser, { new: true });

    res
      .status(200)
      .end();
  } else {
    res
      .status(204)
      .end();
  }
});

Router.delete('/:id', async (req, res) => {
  await blog
    .findByIdAndDelete(req.params.id);

  res
    .status(204)
    .end();
});

module.exports = Router;
