const mongoose = require('mongoose');

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@mk-cluster.cq5bv.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema);

const name = process.argv[3];
const number = process.argv[4];

if (name && number) {
    const person = new Person({
        name, number
    })

    person.save().then(result => {
        mongoose.connection.close()
    })

    return;
}

Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(({ name, number }) => console.log(`${name}: ${number}`))
    mongoose.connection.close()
})

