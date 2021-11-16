const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { logger, config } = require('./utils');
const { unknownEndpoint, handleError, logRequest } = require('./middlewares');
const { personsRouter, infoRouter } = require('./controllers');

logger.info('Connecting o MongoDB');
mongoose.connect(config.DATABASE_URI)
    .then(() => logger.info('connected to MongoDB'))
    .catch((error) => logger.error(
        'error connecting to MongoDB:', error.message)
    );


const app = express();

app.use(cors());
app.use(express.static('static'));
app.use(express.json());
app.use(logRequest);


app.use('/api/persons', personsRouter);
app.use('/api/info', infoRouter);

app.use(unknownEndpoint);
app.use(handleError);

module.exports = app;
