import React from 'react';
import Select from 'react-select';

const InputField = ({ type, name, value, onChange, error, placeholder, options, isMulti }) => {
  switch (type) {
    case 'select':
      return (
        <div className="form-group">
          <label htmlFor={name}>{placeholder}</label>
          <select
            id={name}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={error ? 'invalid' : ''}
          >
            <option value="">Select {placeholder}</option>
            {options.map(opt => (
              <option key={opt.iso2 || opt.value} value={opt.iso2 || opt.value}>
                {opt.name || opt.label}
              </option>
            ))}
          </select>
          {error && <span className="error">{error}</span>}
        </div>
      );

    case 'radio':
      return (
        <div className="form-group">
          <label>{placeholder}:</label>
          <div className="radio-group">
            {options.map(option => (
              <label key={option}>
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={onChange}
                />
                {option}
              </label>
            ))}
          </div>
          {error && <span className="error">{error}</span>}
        </div>
      );

    case 'multi-select':
      return (
        <div className="form-group">
          <label htmlFor={name}>{placeholder}</label>
          <Select
            id={name}
            name={name}
            isMulti={isMulti}
            options={options}
            value={value.map(skill => ({ value: skill, label: skill }))}
            onChange={onChange}
            className="multi-select"
            placeholder="Select Skills"
          />
          {error && <span className="error">{error}</span>}
        </div>
      );

    case 'textarea':
      return (
        <div className="form-group">
          <textarea
            name={name}
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
          />
          {error && <span className="error">{error}</span>}
        </div>
      );

    case 'checkbox':
      return (
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name={name}
              checked={value || false}
              onChange={onChange}
            />
            {placeholder}
          </label>
          {error && <span className="error">{error}</span>}
        </div>
      );

    default:
      return (
        <div className="form-group">
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
            className={error ? 'invalid' : ''}
          />
          {error && <span className="error">{error}</span>}
        </div>
      );
  }
};

export default InputField;
