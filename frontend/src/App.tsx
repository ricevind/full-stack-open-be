import './App.css';

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import {
  Person,
  PersonCreationParams,
  Persons,
  PersonWithTemporaryId,
} from './entities/person.model';
import { personsService } from './entities/person.service';

function useIncludes<Elem>(arr: Elem[]): [(elem: Elem) => boolean] {
  const includes = (elem: Elem) => arr.includes(elem);

  return [includes];
}

function usePersons() {
  const [persons, setPersons] = useState<Persons>([]);

  useEffect(() => {
    personsService.getPersons().then((responseBody) => setPersons(responseBody));
  }, []);

  return [persons, setPersons] as const;
}

function App(): JSX.Element {
  const [persons, setPersons] = usePersons();
  const [newPerson, setNewPerson] = useState<PersonCreationParams>({
    name: '',
    number: '',
  });
  const [nameAlreadyExist] = useIncludes(persons.map(({ name }) => name));
  const [successNotification, setSuccessNotification] = useState<null | string>(null);
  const [errorNotification, setErrorNotification] = useState<null | string>(null);

  const displaySuccessMessage = (message: string) => {
    setSuccessNotification(message);

    setTimeout(() => setSuccessNotification(null), 2000);
  };

  const displayErrorMessage = (message: string) => {
    setErrorNotification(message);

    setTimeout(() => setErrorNotification(null), 2000);
  };

  const onAddPerson = (e: FormEvent) => {
    e.preventDefault();

    if (nameAlreadyExist(newPerson.name)) {
      const shouldReplace = confirm(
        `${newPerson.name} is already in teh phone book, replace the old number with a new one ?`,
      );

      if (!shouldReplace) {
        return;
      }

      const person = persons.find((p) => p.name === newPerson.name);

      if (person && Person.isCreatedPerson(person)) {
        const updatedPerson = { ...person, ...newPerson };

        setPersons(Person.updatePerson(persons, updatedPerson));

        personsService
          .updatePerson(updatedPerson)
          .then(() => setNewPerson({ name: '', number: '' }))
          .then(() => displaySuccessMessage(`${updatedPerson.name} has been updated`))
          .catch(() => {
            return setPersons(persons);
          });

        return;
      }
    }

    const temporaryId = Math.random() * 1000 + '';
    const newPersonWithTemporaryId: PersonWithTemporaryId = { ...newPerson, temporaryId };
    setPersons(persons.concat(newPersonWithTemporaryId));
    setNewPerson({ name: '', number: '' });

    personsService
      .addPerson(newPerson)
      .then((data) =>
        setPersons((persons) =>
          Person.removePersonById(persons, temporaryId).concat(data),
        ),
      )
      .then(() => displaySuccessMessage(`${newPerson.name} has been created`));
  };

  const onDeletePerson = (person: Person) => {
    const canDelete = confirm(`Should ${person.name} be deleted ?`);
    const personServerId = Person.getPersonServerId(person);

    if (canDelete) {
      setPersons(Person.removePerson(persons, person));

      personsService.deletePerson(personServerId).catch((e) => {
        console.log(e);
        if (e === 404) {
          displayErrorMessage(`${person.name} was already removed from the server`);
          return;
        }

        setPersons(persons);
      });
    }
  };

  const onNewNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewPerson({ ...newPerson, name });
  };

  const onNewNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;
    setNewPerson({ ...newPerson, number });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={onAddPerson}>
        <div>
          name: <input value={newPerson.name} onChange={onNewNameChange} />
        </div>
        <div>
          number: <input value={newPerson.number} onChange={onNewNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>

      {successNotification && (
        <div className="notification notification_success">{successNotification}</div>
      )}
      {errorNotification && (
        <div className="notification notification_error">{errorNotification}</div>
      )}

      {persons.map((person) => (
        <div key={person.name} style={{ display: 'flex' }}>
          <div>{person.name}</div>
          <div>{person.number}</div>
          <button onClick={() => onDeletePerson(person)} type="button">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
