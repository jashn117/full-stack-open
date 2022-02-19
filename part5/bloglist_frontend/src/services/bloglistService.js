import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

let token = null;

const setToken = (value) => {
  if (value) {
    token = `Bearer ${value}`;
  } else {
    token = null;
  }
};

// ********************************************************
// Request(s) to /api/login
// ********************************************************
const login =  (username, password) => {
  const res = axios
    .post(`${BASE_URL}/login`, { username, password });

  return res
    .then((res) => res.data);
};

// ********************************************************
// Request(s) to /api/blogs
// ********************************************************
const getAllBlogs = () => {
  const res = axios
    .get(`${BASE_URL}/blogs`);

  return res
    .then((res) => res.data);
};

const getBlog = (blog_id) => {
  const res = axios
    .get(`${BASE_URL}/blogs/${blog_id}`);

  return res
    .then((res) => res.data);
};

const createBlog = (title, author, url) => {
  const blog = {
    title,
    author,
    url,
  };

  const config = {
    headers: {
      Authorization: token,
    },
  };

  const res = axios
    .post(`${BASE_URL}/blogs`, blog, config);

  return res
    .then((res) => res.data);
};

const likeBlog = (blog_id) => {
  const res = axios
    .put(`${BASE_URL}/blogs/${blog_id}`, {});

  return res
    .then((res) => res.data);
};

const deleteBlog = (blog_id) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const res = axios
    .delete(`${BASE_URL}/blogs/${blog_id}`, config);

  return res
    .then((res) => res.data);
};

export {
  setToken,
  login,
  getAllBlogs,
  getBlog,
  createBlog,
  likeBlog,
  deleteBlog,
};
