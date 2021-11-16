const personsRouter = new require('express').Router();

const { personModel } = require('../models');

personsRouter.get('/', (_, res) => {
    personModel.getPersons().then(persons => res.json(persons));
});


personsRouter.get('/:id', (req, res, next) => {
    const personId = req.params.id;
    const person = personModel.getPerson(personId);

    person.then(p => {
        if (p) {
            res.json(p);
            return;
        }

        res.statusMessage = 'Person not found';
        res.status(404);
        res.send();
    }).catch(e => next(e));
});


personsRouter.delete('/:id', (req, res, next) => {
    const personId = req.params.id;

    personModel.deletePerson(personId).then(() => {
        res.statusMessage = 'Person deleted';
        res.status(204);
        res.send();
    }).catch(e => next(e));
});

personsRouter.put('/:id', (req, res, next) => {
    const person = req.body;
    const personId = req.params.id;

    personModel.updatePerson(personId, person).then(p => {
        if (p) {
            res.json(p);
            return;
        }

        res.statusMessage = 'Person not found';
        res.status(404);
        res.send();
    }).catch(e => next(e));
});

personsRouter.post('', (req, res, next) => {
    const personCandidate = req.body;

    personModel.addPerson(personCandidate).then(person => {
        res.status(201);
        res.json(person);
    }).catch(e => next(e));
});

module.exports = personsRouter;
