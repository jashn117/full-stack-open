const http = require('http');

const app = require('./app');
const logger = require('./utils/logger');
const config = require('./utils/config');

const server = http.createServer(app);

server.listen(config.PORT || 3001, () => {
  logger.info(`Listening on ${config.PORT || 3001}`);
});
