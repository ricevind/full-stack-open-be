import { CreatedPerson, PersonCreationParams, Persons } from './person.model';

const personsUrl = '/api/persons';

const getPersons = () =>
  fetch(personsUrl)
    .then((response) => response.json())
    .then((responseBody) => {
      const arePersons = (rb: unknown): rb is Persons =>
        Array.isArray(responseBody) && 'name' in responseBody[0];

      if (arePersons(responseBody)) {
        return responseBody;
      }
      throw new Error('API did not returned compatible response');
    });

const addPerson = (person: PersonCreationParams) =>
  fetch(personsUrl, {
    method: 'POST',
    body: JSON.stringify(person),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  }).then((response) => response.json());

const deletePerson = (id: string | undefined) => {
  if (id) {
    return fetch(`${personsUrl}/${id}`, { method: 'DELETE' }).then((response) => {
      if (response.ok) {
        return response;
      }

      throw response.status;
    });
  }

  return Promise.resolve();
};

const updatePerson = (updatedPerson: CreatedPerson) =>
  fetch(`${personsUrl}/${updatedPerson.id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedPerson),
  }).then((response) => {
    if (response.ok) {
      return response;
    }

    throw 'Update failed';
  });

export const personsService = {
  getPersons,
  addPerson,
  deletePerson,
  updatePerson,
};
