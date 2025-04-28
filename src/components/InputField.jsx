// InputField.jsx
import React from 'react';

const InputField = ({ type, name, placeholder, value, onChange, error,checked }) => {
  return (
    <div className="form-group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        className={error ? 'invalid' : ''}
        checked={checked}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default InputField;
