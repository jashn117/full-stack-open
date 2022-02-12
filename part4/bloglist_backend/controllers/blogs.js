/* eslint-disable no-underscore-dangle */
const Router = require('express').Router();

const Blog = require('../models/blog');
// const User = require('../models/user');
const middleware = require('../utils/middleware');

Router.get('/', async (req, res) => {
  const result = await Blog
    .find({})
    .populate('user', {
      username: 1,
      firstName: 1,
      lastName: 1,
    });

  res
    .json(result);
});

Router.get('/:id', async (req, res) => {
  const result = await Blog
    .findById(req.params.id)
    .populate('user', {
      username: 1,
      firstName: 1,
      lastName: 1,
    });

  if (result) {
    res
      .json(result);
  } else {
    res
      .status(404)
      .end();
  }
});

Router.post('/', middleware.tokenExtractor, middleware.extractUser, async (req, res) => {
  const { user } = req;

  if (user) {
    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes,
      user: user._id,
    });

    const result = await blog
      .save();

    await user
      .update({
        blogs: user.blogs.concat(blog._id),
      });

    res
      .status(201)
      .json(result);
  } else {
    res
      .status(401)
      .json({ error: 'Access Denied!' });
  }
});

Router.put('/:id', async (req, res) => {
  const blog = await Blog
    .findById(req.params.id);

  if (blog) {
    const newBlog = blog.toJSON();
    newBlog.likes += 1;

    await Blog
      .findByIdAndUpdate(newBlog.id, newBlog, { new: true });

    res
      .status(200)
      .end();
  } else {
    res
      .status(204)
      .end();
  }
});

Router.delete('/:id', middleware.tokenExtractor, middleware.extractUser, async (req, res) => {
  const { user } = req;
  const expectedUser = await Blog
    .findById(req.params.id)
    .user;

  if (user && user._id.toString() === expectedUser.toString()) {
    await Blog
      .findByIdAndDelete(req.params.id);

    res
      .status(204)
      .end();
  } else {
    res
      .status(401)
      .json('Access Denied!');
  }
});

module.exports = Router;
