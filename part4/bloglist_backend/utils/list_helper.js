/* eslint-disable no-unused-vars */
const lodash = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => (
  blogs.length === 0
    ? 0
    : blogs.reduce((likes, blog) => likes + blog.likes, 0)
);

const favoriteBlog = (blogs) => (
  blogs.length === 0
    ? {}
    : blogs.reduce((fav, blog) => (
      fav.likes < blog.likes
        ? blog : fav
    ), { likes: -1 })
);

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const authors = lodash
    .uniq(blogs.map((blog) => blog.author));

  const blogCount = authors.map((author) => (
    {
      author,
      blogs: blogs.reduce((accum, blog) => (
        author === blog.author
          ? accum + 1 : accum
      ), 0),
    }
  ));

  return blogCount.reduce((max, elem) => (
    max.blogs < elem.blogs
      ? elem : max
  ), { blogs: -1 });
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const authors = lodash
    .uniq(blogs.map((blog) => blog.author));

  const likeCount = authors.map((author) => (
    {
      author,
      likes: blogs.reduce((accum, blog) => (
        author === blog.author
          ? accum + blog.likes : accum
      ), 0),
    }
  ));

  return likeCount.reduce((max, elem) => (
    max.likes < elem.likes
      ? elem : max
  ), { likes: -1 });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
