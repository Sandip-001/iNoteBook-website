import React from "react";

const Alert = ({ message, type }) => {
  return (
    message && (
      <div className={`alert alert-${type}`} role="alert">
        {message}
      </div>
    )
  );
};

export default Alert;
