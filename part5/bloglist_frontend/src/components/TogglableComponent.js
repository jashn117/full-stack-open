import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const Togglable = (props) => {
  const [isHidden, setVisibility] = useState(true);

  const toggleVisibility = () => {
    setVisibility(!isHidden);
  };

  return (
    <div>
      {isHidden
        ? (
          <>
            <button onClick={toggleVisibility}>
              {props.buttonLabel}
            </button>
          </>
        )
        : (
          <>
            {props.children}
            <button onClick={toggleVisibility}>
              Cancel
            </button>
          </>
        )}
    </div>
  );
};

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export {
  Togglable,
};
