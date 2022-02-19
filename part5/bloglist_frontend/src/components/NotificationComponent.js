import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ isError, message }) => {
  if (!message) {
    return null;
  }

  const color = isError
    ? 'red'
    : 'green';

  const style = {
    width: 'auto',
    height: 'auto',
    padding: '5px',
    margin: '10px',
    border: 'solid',
    borderColor: color,
    borderRadius: '5px',
    backgroundColor: 'gainsboro',
    fontSize: '1.1em',
    color,
  };

  return (
    <div style={style}>
      <p>{message}</p>
    </div>
  );
};

Notification.propTypes = {
  isError: PropTypes.bool.isRequired,
};

export {
  Notification,
};
