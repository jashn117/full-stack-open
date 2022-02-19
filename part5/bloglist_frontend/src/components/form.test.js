import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Form } from './FormComponent';

describe('Component: Form', () => {
  test('The component calls the callback func after clicking submit', () => {
    const formCallback = jest.fn();
    const inputCallback = jest.fn();

    const form = {
      onSubmit: formCallback,
      inputs: [
        {
          name: 'input',
          type: 'text',
          value: 'value',
          onChange: inputCallback,
          required: false,
        },
      ],
      submit: {
        value: 'Submit',
      },
    };

    render(
      <Form
        onSubmit={form.onSubmit}
        inputs={form.inputs}
        submit={form.submit}
      />
    );

    const submitButton = screen
      .getByText('Submit');

    userEvent.click(submitButton);

    expect(formCallback.mock.calls)
      .toHaveLength(1);
  });
});
