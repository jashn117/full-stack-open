import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ inputObj }) => {
  if (inputObj.required) {
    return (
      <>
        <label>
          {inputObj.name}
          <input
            type={inputObj.type}
            value={inputObj.value}
            onChange={inputObj.onChange}
            required
          />
        </label>
        <br />
      </>
    );
  } else {
    return (
      <>
        <label>
          {inputObj.name}
          <input
            type={inputObj.type}
            value={inputObj.value}
            onChange={inputObj.callback}
          />
        </label>
        <br />
      </>
    );
  }
};

const Form = ({ onSubmit, inputs, submit }) => (
  <>
    <form onSubmit={onSubmit}>
      {inputs.map((input, idx) => (
        <Input
          key={idx}
          inputObj={input}
        />
      ))}
      <input
        type='submit'
        value={submit.value}
      />
      <br />
    </form>
  </>
);

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  inputs: PropTypes.array.isRequired,
  submit: PropTypes.object.isRequired,
};

export {
  Input,
  Form,
};