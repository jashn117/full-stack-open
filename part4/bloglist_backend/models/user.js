/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    validate: {
      validator: (val) => (
        /^[a-zA-Z]*$/.test(val)
      ),
      message: (props) => (
        `${props.value} is not a valid first name. No numbers or special characters allowed`
      ),
    },
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    validate: {
      validator: (val) => (
        /^[a-zA-Z]*$/.test(val)
      ),
      message: (props) => (
        `${props.value} is not a valid last name. No numbers or special characters allowed`
      ),
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();

    delete returnedObj.__v;
    delete returnedObj._id;
    delete returnedObj.password;
  },
});

module.exports = mongoose.model('User', userSchema);
