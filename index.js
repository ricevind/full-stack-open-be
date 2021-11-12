const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const static = require('')
const initPersons = require('./persons.json')

let persons = [...initPersons];
const app = express();


app.use(cors())
app.use(express.static('static'))
app.use(express.json())

morgan.token('body', (req) => console.log(req.body) || JSON.stringify(req.body))
app.use(morgan(':method :url :status :total-time[3] :body'))


app.get('/api/persons', (req, res) => {
    res.json(persons)
});

app.get('/api/info', (req, res) => {
    const message = `Phonebook has info for ${persons.length} people`;
    const date = (new Date()).toLocaleString('pl-PL', { dateStyle: 'full', timeStyle: 'long' });
    const info = `${message}\n\r${date}`

    res.send(info)
});

app.get('/api/persons/:id', (req, res) => {
    const personId = +req.params.id;
    const person = persons.find(person => person.id === personId);

    if (person) {
        res.json(person);
        return;
    }

    res.statusMessage = 'Person not found';
    res.status(404);
    res.send();
})


app.delete('/api/persons/:id', (req, res) => {
    const personId = +req.params.id;
    persons = persons.filter(person => person.id !== personId);

    res.statusMessage = 'Person deleted';
    res.status(204);
    res.send();
})

app.post('/api/persons', (req, res) => {

    const personCandidate = req.body || {};
    const hasRequiredKeys = 'name' in personCandidate && 'number' in personCandidate;

    if (!hasRequiredKeys) {
        res.status(400);
        res.json({
            error: `Required properties are name and number`
        })
        return
    }

    const keysHasCorrectValueTypes = typeof personCandidate.name === 'string' && typeof personCandidate.number === 'string'
    if (!keysHasCorrectValueTypes) {
        res.status(400);
        res.json({
            error: `Required type is {number: string, name: string}`
        })
        return
    }

    if (persons.some(p => p.name === personCandidate.name)) {
        res.statusMessage = `${personCandidate.name} Exists`;
        res.status(409);
        res.end();
        return
    }
    const personId = '' + Math.random() * 100000;

    const person = { ...personCandidate, id: personId };
    persons.push(person);

    res.status(201);
    res.json(person)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT);

console.log(`Server is listening on ${PORT}`)