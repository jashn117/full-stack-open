const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./mongo');

const app = express();

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan((tokens, req, res) => (
  [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body),
  ].join(' ')
)));

app.get('/info', (req, res) => {
  console.log('Fetching phonebook metadata...');
  db
    .getAll()
    .then((result) => {
      res.send(`Phonebook has ${result.length} records. ${new Date().toString()}`);
    });
});

app.get('/api/persons', (req, res) => {
  console.log('Fetching phonebook records...');
  db
    .getAll()
    .then((result) => {
      res.json(result);
    });
});

app.get('/api/persons/:id', (req, res, next) => {
  db
    .getPersonWithID(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        console.log(`No record with ID ${req.params.id} found.`);
      }
    })
    .catch((err) => next(err));
});

app.post('/api/persons', (req, res, next) => {
  console.log('Creating a new record...');

  if (req.body.name && req.body.number) {
    db
      .create(req.body.name, req.body.number)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => next(err));
  } else {
    res.status(400).send('Provide a name and a number.');
  }
});

app.put('/api/persons/:id', (req, res, next) => {
  console.log(`Updating record with id ${req.params.id}`);

  db
    .updatePersonWithID(req.params.id, req.body)
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  db
    .removePersonWithID(req.params.id)
    .then(() => {
      console.log('Record deleted.');
    })
    .catch((err) => next(err));

  res.status(204).end();
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === 'CastError') {
    res
      .status(400)
      .send({ error: 'Invalid ID!' });
  } else if (err.name === 'ValidatorError') {
    res
      .status(400)
      .json({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
