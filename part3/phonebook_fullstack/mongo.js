// const mongoose = require('mongoose');
const Person = require('./models/person');

const create = (name, number) => {
  const person = new Person({
    name,
    number,
  });

  return person
    .save()
    .then((result) => result);
};

const getAll = () => (
  Person
    .find({})
    .then((people) => people)
);

const getPersonWithID = (id) => (
  Person
    .findById(id)
    .then((person) => person)
);

const updatePersonWithID = (id, obj) => (
  Person
    .findByIdAndUpdate(id, obj, { new: true })
    .then((result) => result)
);

const removePersonWithID = (id) => (
  Person
    .findByIdAndDelete(id)
    .then((result) => result)
);

module.exports = {
  create, getAll, getPersonWithID, updatePersonWithID, removePersonWithID,
};
