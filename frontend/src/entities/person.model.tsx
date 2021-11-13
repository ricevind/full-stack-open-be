type BasePerson = {
  name: string;
  number: string;
};

export type CreatedPerson = {
  id: string;
} & BasePerson;

export type PersonWithTemporaryId = {
  temporaryId: string;
} & BasePerson;

export type Person = CreatedPerson | PersonWithTemporaryId;

export type PersonCreationParams = Omit<Person, 'id'>;

export type Persons = Person[];

const isCreatedPerson = (person: Person): person is CreatedPerson => 'id' in person;

const getPersonId = (person: Person) =>
  isCreatedPerson(person) ? person.id : person.temporaryId;

const getPersonServerId = (person: Person) =>
  isCreatedPerson(person) ? person.id : undefined;

const removePerson = (persons: Persons, removedPerson: Person) =>
  removePersonById(persons, getPersonId(removedPerson));

const removePersonById = (persons: Persons, removedId: string) =>
  persons.filter((person) => getPersonId(person) !== removedId);

const updatePerson = (persons: Persons, updatedPerson: CreatedPerson) =>
  persons.map((person) =>
    getPersonId(person) === updatedPerson.id ? { ...person, ...updatedPerson } : person,
  );

export const Person = {
  isCreatedPerson,
  getPersonId,
  getPersonServerId,
  removePerson,
  removePersonById,
  updatePerson,
};
