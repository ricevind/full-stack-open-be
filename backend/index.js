require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { personModel } = require('./models')

mongoose.connect(process.env.DATABASE_URI);
const app = express();


app.use(cors())
app.use(express.static('static'))
app.use(express.json())

morgan.token('body', (req) => console.log(req.body) || JSON.stringify(req.body))
app.use(morgan(':method :url :status :total-time[3] :body'))



app.get('/api/persons', (_, res) => {
    personModel.getPersons().then(persons => res.json(persons))
});

app.get('/api/info', (req, res) => {
    personModel.getPersons().then(persons => {
        const message = `Phonebook has info for ${persons.length} people`;
        const date = (new Date()).toLocaleString('pl-PL', { dateStyle: 'full', timeStyle: 'long' });
        const info = `${message}\n\r${date}`

        res.send(info)
    })
});

app.get('/api/persons/:id', (req, res, next) => {
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
    }).catch(e => next(e))
})


app.delete('/api/persons/:id', (req, res, next) => {
    const personId = req.params.id;
    personModel.deletePerson(personId).then(() => {
        res.statusMessage = 'Person deleted';
        res.status(204);
        res.send();
    }).catch(e => next(e));
})

app.put('/api/persons/:id', (req, res, next) => {
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
    }).catch(e => next(e))
})

app.post('/api/persons', (req, res, next) => {

    const personCandidate = req.body;

    personModel.addPerson(personCandidate).then(person => {
        res.status(201);
        res.json(person)
    }).catch(e => next(e))

})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


function handleError(error, req, res, next) {
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
        console.error(JSON.stringify(error, null, 2))
        return res.status(400).send({ error: error.message })
    }

    next(error)
}
app.use(handleError)

const PORT = process.env.PORT || 3001;
app.listen(PORT);

console.log(`Server is listening on ${PORT}`)