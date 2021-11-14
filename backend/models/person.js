const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const personSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: true, minLength: 3
    },
    number: {
        type: String, required: true
    },
})

personSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
personSchema.plugin(uniqueValidator)

const Person = new mongoose.model('Person', personSchema);


function addPerson({ name, number }) {
    const person = new Person({ name, number });
    return person.save()
}

function getPersons() {
    return Person.find({})
}

function getPerson(id) {
    return Person.findById(id)
}

function deletePerson(id) {
    return Person.findByIdAndRemove(id)
}

function isNameTaken(name) {
    return Person.find({ name }).then(p => {
        return p.length > 0;
    })
}

function updatePerson(personId, person) {
    return Person.findByIdAndUpdate(personId, person, { new: true })
}

module.exports.person = {
    addPerson, getPersons, getPerson, deletePerson, isNameTaken, updatePerson
}