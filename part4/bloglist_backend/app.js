const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

require('express-async-errors');

const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const app = express();

logger.info('connecting to mongo atlas db...');

(async () => {
  await mongoose
    .connect(config.MONGO_URI);

  logger.info('connected');
})();

app.use(cors());
// app.use(express.static('build'));
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

app.get('/', (req, res) => {
  res
    .send('Welcome to Bloglist.');
});

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
