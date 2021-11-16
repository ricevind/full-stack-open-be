const http = require('http');

const app = require('./app');
const { logger, config } = require('./utils');

const server = http.createServer(app);
server.listen(
    config.PORT,
    () => {
        logger.info(`Server running on port ${config.PORT}`);
    }
);
