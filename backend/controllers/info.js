const infoRouter = new require('express').Router();
const personModel = require('../models');

infoRouter.get('/', (req, res) => {
    personModel.getPersons().then(persons => {
        const message = `Phonebook has info for ${persons.length} people`;
        const date = (new Date()).toLocaleString('pl-PL', { dateStyle: 'full', timeStyle: 'long' });
        const info = `${message}\n\r${date}`;

        res.send(info);
    });
});

module.exports = infoRouter;
