/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URI;

console.log('connecting to mongo atlas db...');

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log('connected to db.');
  })
  .catch((error) => {
    console.log('ERROR', `{${error.message}}`);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'A name is required!'],
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (val) => (
        /^\d{2,3}-\d*$/.test(val)
      ),
      message: (props) => `${props.value} is not a valid phone number`,
    },
    required: [true, 'A phone number is required!'],
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
