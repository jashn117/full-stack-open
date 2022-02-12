const Blog = require('../models/blog');
const User = require('../models/user');

const someUsers = [
  {
    username: 'brAndy',
    firstName: 'Andy',
    lastName: 'Walters',
    password: '13579',
    blogs: [],
  },
  {
    username: 'chimp_shaver',
    firstName: 'Brandon',
    lastName: 'Pikman',
    password: 'password',
    blogs: [],
  },
];

const someBlogs = [
  {
    title: "Sammy's crunchy hashbrown recipe",
    author: 'Sammy Hoofner',
    url: 'https://sammyscorner.com/yum/crunchyhashbrown',
    likes: 57,
    user: '6207f28f029c5e58f5979660',
  },
  {
    title: "Sammy's cripsy hashbrown recipe",
    author: 'Sammy Hoofner',
    url: 'https://sammyscorner.com/yum/crispyhashbrown',
    likes: 68,
    user: '6207f28f029c5e58f5979660',
  },
  {
    title: 'How to sneak snacks into a cinema',
    author: 'Brinda Sanders',
    url: 'https://millenialneighbor.com/lifehacks/12974483',
    likes: 735,
    user: '6207f28f029c5e58f5979660',
  },
];

const getAllBlogsFromDB = async () => {
  const blogs = await Blog
    .find({})
    .populate('user');

  return blogs.map((blog) => blog.toJSON());
};

const getAllUsersFromDB = async () => {
  const users = await User
    .find({})
    .populate('blogs');

  return users.map((user) => user.toJSON());
};

const getValidBlogID = async () => {
  const blogs = await getAllBlogsFromDB();

  return blogs[0].id;
};

const getValidUserID = async () => {
  const users = await getAllUsersFromDB();

  return users[0].id;
};

const getInvalidBlogID = async () => {
  const blog = new Blog({
    title: 'I\'ll be gone soon',
    author: 'Saint Jiub',
    url: 'https://nonexistantwebpage.com/jiub/404',
    likes: 0,
    user: '61fe40e42f040dcc5e7319fd',
  });

  await blog
    .save();
  await blog
    .remove();

  // eslint-disable-next-line no-underscore-dangle
  return blog._id
    .toString();
};

const getInvalidUserID = async () => {
  const user = new User({
    username: 'cliffrider_killa',
    firstName: 'Saint',
    lastName: 'Jiub',
    password: 'passwd',
    blogs: [],
  });

  await user
    .save();
  await user
    .remove();

  // eslint-disable-next-line no-underscore-dangle
  return user._id
    .toString();
};

module.exports = {
  someUsers,
  someBlogs,
  getAllBlogsFromDB,
  getAllUsersFromDB,
  getValidBlogID,
  getValidUserID,
  getInvalidBlogID,
  getInvalidUserID,
};
