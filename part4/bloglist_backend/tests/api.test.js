/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./testHelper');

const config = require('../utils/config');

const api = supertest(app);

// Clear the test database and repopulate
// it with some valid users and blogs
beforeEach(async () => {
  await Blog
    .deleteMany({});

  const blogs = helper.someBlogs
    .map((obj) => new Blog(obj));
  const blogPromises = blogs
    .map((blog) => blog.save());

  await Promise.all(blogPromises);
});

describe('API', () => {
  // describe('GET requests to /api/users', () => {
  //   test('responds with code 200 and contains expected number of users', async () => {
  //     const res = await api
  //       .get('/api/users')
  //       .expect(200)
  //       .expect('content-type', /application\/json/);

  //     expect(res)
  //       .toHaveLength(helper.someUsers.length);
  //   });

  //   test('response contains an expected user', async () => {
  //     const res = await api
  //       .get('/api/users')
  //       .expect(200);

  //     const users = res
  //       .map((user) => user.username);

  //     expect(users)
  //       .toContain(helper.users[0].username);
  //   });

  //   describe('to /api/users/:id', () => {
  //     test('responds with code 200 and the expected user given a valid ID', async () => {
  //       const id = helper
  //         .getValidUserID();

  //       const res = await api
  //         .get(`/api/users/${id}`)
  //         .expect(200)
  //         .expect('content-type', /application\/json/);

  //       const expectedUser = await User
  //         .findById(id)
  //         .toJSON();

  //       expect(res)
  //         .toEqual(expectedUser);
  //     });

  //     test('responds with code 404 given an invalid ID', async () => {
  //       const id = helper
  //         .getInvalidUserID();

  //       await api
  //         .get(`/api/users/${id}`)
  //         .expect(404);
  //     });
  //   });
  // });

  describe('GET requests to /api/blogs', () => {
    test('responds with status 200 and content is json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('content-type', /application\/json/);
    }, 10000);

    test('sends back all the expected number of blogs', async () => {
      const res = await api
        .get('/api/blogs');

      expect(res.body)
        .toHaveLength(helper.someBlogs.length);
    });

    test('response contains an expected blog', async () => {
      const res = await api
        .get('/api/blogs');

      const titles = res.body.map((blog) => blog.title);

      expect(titles)
        .toContain(helper.someBlogs[1].title);
    });

    describe('to /api/blogs/:id', () => {
      test('responds with code 200 and the expected blog given a valid ID', async () => {
        const id = await helper
          .getValidBlogID();

        const res = await api
          .get(`/api/blogs/${id}`)
          .expect(200)
          .expect('content-type', /application\/json/);

        const expectedBlog = await Blog
          .findById(id)
          .populate('user', {
            username: 1,
            firstName: 1,
            lastName: 1,
          });

        expect(res.body)
          .toEqual(expectedBlog.toJSON());
      });

      test('responds with code 404 given an ID for an non-existing blog', async () => {
        const id = await helper
          .getInvalidBlogID();

        await api
          .get(`/api/blogs/${id}`)
          .expect(404);
      });
    });
  });

  // describe('POST requests to /api/users', () => {
  //   test('responds with code 400 given a user with missing required properties', async () => {
  //     const newUser = {
  //       username: 'sUwUsan',
  //       firstName: 'Susan',
  //       lastName: 'Brown',
  //       blogs: [],
  //     };

  //     await api
  //       .post('/api/users')
  //       .send(newUser)
  //       .expect(400);

  //     const users = await helper
  //       .getAllUsersFromDB();

  //     expect(users)
  //       .toHaveLength(helper.someUsers.length);
  //   });

  //   test('responds with code 201 and makes expected changes given a valid user object',
  // async () => {
  //     const newUser = {
  //       username: 'sUwUsan',
  //       firstName: 'Susan',
  //       lastName: 'Brown',
  //       password: '1029384756',
  //       blogs: [],
  //     };

  //     await api
  //       .post('/api/users')
  //       .send(newUser)
  //       .expect(201)
  //       .expect('content-type', /application\/json/);

  //     const users = await helper
  //       .getAllUsersFromDB();

  //     expect(users)
  //       .toHaveLength(helper.someUsers.length + 1);

  //     expect(users.map((user) => user.username))
  //       .toContain(newUser.username);
  //   });
  // });

  describe('POST requests to /api/login', () => {
    test('responds with code 401 given invalid username', async () => {
      const userInfo = {
        username: 'Moses420',
        password: 'partyomommaslegs',
      };

      await api
        .post('/api/login')
        .send(userInfo)
        .expect(401);
    });

    test('responds with code 200 and a jwt token given valid username and password', async () => {
      const userInfo = {
        username: helper.someUsers[0].username,
        password: helper.someUsers[0].password,
      };

      const res = await api
        .post('/api/login')
        .send(userInfo)
        .expect(200)
        .expect('content-type', /application\/json/);

      expect(res.body.username)
        .toBe(userInfo.username);

      expect(res.body.name)
        .toBe(`${helper.someUsers[0].firstName} ${helper.someUsers[0].lastName}`);

      const userIDInToken = jwt
        .verify(res.body.token, config.SECRET).id;

      const expectedUser = await User
        .findOne({ username: userInfo.username })
        .populate('blogs', {
          author: 1,
          title: 1,
          url: 1,
        });

      expect(userIDInToken)
        .toEqual(expectedUser.toJSON().id);
    });
  });

  describe('POST requests to /api/blogs', () => {
    test('responds with code 400 given a blog with a missing required properties', async () => {
      const userInfo = {
        username: helper.someUsers[1].username,
        password: helper.someUsers[1].password,
      };

      const res = await api
        .post('/api/login')
        .send(userInfo);

      const obj = {
        author: 'Dr. Havnar Snowstorm',
        likes: 149,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${res.body.token}`)
        .send(obj)
        .expect(400);

      const blogs = await helper
        .getAllBlogsFromDB();

      expect(blogs)
        .toHaveLength(helper.someBlogs.length);
    });

    test('responds with code 201 and makes expected changes given a valid blog object', async () => {
      const userInfo = {
        username: helper.someUsers[0].username,
        password: helper.someUsers[0].password,
      };

      const res = await api
        .post('/api/login')
        .send(userInfo);

      const obj = {
        title: 'How to cure crippling depression',
        author: 'Dr. Havnar Snowstorm',
        url: 'https://mentalfaculty.com/depression/cure',
        likes: 149,
        user: '6207f293029c5e58f5979664',
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${res.body.token}`)
        .send(obj)
        .expect(201)
        .expect('content-type', /application\/json/);

      const blogs = await helper
        .getAllBlogsFromDB();

      const titles = blogs
        .map((elem) => elem.title);

      expect(blogs)
        .toHaveLength(helper.someBlogs.length + 1);

      expect(titles)
        .toContain(obj.title);
    });

    test('responds with code 201 and adds a blog with 0 likes given an object with no "likes" prop', async () => {
      const blogsBefore = await helper.getAllBlogsFromDB();

      const userInfo = {
        username: helper.someUsers[0].username,
        password: helper.someUsers[0].password,
      };

      const loginRes = await api
        .post('/api/login')
        .send(userInfo);

      const obj = {
        title: 'Unspoken truths about lasagna',
        author: 'David Smith',
        url: 'https://newyug.com/blogs/diet/246498',
        user: '6207f293029c5e58f5979664',
      };

      const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .send(obj)
        .expect(201);

      const blogsAfter = await helper.getAllBlogsFromDB();

      expect(blogsAfter)
        .toHaveLength(blogsBefore.length + 1);

      expect(res.body.likes)
        .toBeDefined();

      expect(res.body.likes)
        .toBe(0);
    });

    test('responds with code 201 and makes expected changes given a valid blog object', async () => {
      const obj = {
        title: 'How to cure crippling depression',
        author: 'Dr. Havnar Snowstorm',
        url: 'https://mentalfaculty.com/depression/cure',
        likes: 149,
        user: '6207f293029c5e58g5979664',
      };

      await api
        .post('/api/blogs')
        .send(obj)
        .expect(401);
    });
  });

  describe('PUT requests to /api/blogs/:id', () => {
    test('responds with code 200 and increments the likes of the blog given a valid ID', async () => {
      const blogs = await helper.getAllBlogsFromDB();
      const blog = blogs[0];

      await api
        .put(`/api/blogs/${blog.id}`)
        .send({})
        .expect(200);

      const blogAfterUpdate = await Blog
        .findById(blog.id);

      expect(blogAfterUpdate.toJSON().likes)
        .toBe(blog.likes + 1);
    }, 10000);

    test('responds with code 204 and makes no changes given invalid ID', async () => {
      const id = await helper.getInvalidBlogID();

      await api
        .put(`/api/blogs/${id}`)
        .send({})
        .expect(204);
    });
  });

  describe('DELETE requests to /api/blogs', () => {
    test('responds with code 204 and removes the expected blog given a valid ID', async () => {
      const blogs = await helper.getAllBlogsFromDB();
      const initialLength = blogs.length;
      const { id } = blogs[0];

      const userInfo = {
        username: helper.someUsers[0].username,
        password: helper.someUsers[0].password,
      };

      const res = await api
        .post('/api/login')
        .send(userInfo);

      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${res.body.token}`)
        .expect(204);

      const blogsAfterDelete = await helper.getAllBlogsFromDB();

      expect(blogsAfterDelete)
        .toHaveLength(initialLength - 1);

      expect(blogsAfterDelete.map((blog) => blog.id))
        .not
        .toContain(id);
    });

    test('responds with code 204 and makes no changes given an invalid ID', async () => {
      const blogs = await helper.getAllBlogsFromDB();
      const initialLength = blogs.length;
      const id = await helper.getInvalidBlogID();

      const userInfo = {
        username: helper.someUsers[0].username,
        password: helper.someUsers[0].password,
      };

      const res = await api
        .post('/api/login')
        .send(userInfo);

      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${res.body.token}`)
        .expect(204);

      const blogsAfterDelete = await helper
        .getAllBlogsFromDB();

      expect(blogsAfterDelete)
        .toHaveLength(initialLength);
    });
  });

  describe('Misc', () => {
    test('all blogs have the unique id property', async () => {
      const blogs = await helper.getAllBlogsFromDB();

      blogs.forEach((blog) => {
        expect(blog.id)
          .toBeDefined();
      });
    });
  });
});

afterAll(() => {
  Blog
    .deleteMany({});

  mongoose.connection.close();
});
