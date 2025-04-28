import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import './UserForm.css';
import Select from 'react-select';
import formFields from '../config/formFields';
import skillOptions from '../config/skillOptions';
import initialState from '../config/initialState';
import axios from 'axios';
import validateField from '../utils/validation';

const UserForm = () => {
  const { users, addUser, editIndex, updateUser } = useContext(UserContext);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');


  useEffect(() => {
    if (editIndex !== null && users[editIndex]) {
      setFormData(users[editIndex]);
    } else {
      setFormData(initialState); // Reset form if no user selected
    }
  }, [editIndex, users]);
  

  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Special case for country and state selection
    if (name === 'country') {
      setSelectedCountry(value);
      setFormData(prev => ({ ...prev, state: '', city: '' }));
      setStates([]);
      setCities([]);
    }
    if (name === 'state') {
      setSelectedState(value);
      setFormData(prev => ({ ...prev, city: '' }));
      setCities([]);
    }

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  
    console.log("data changed");
  };

  const handleSkillChange = (selectedOptions) => {
    const skills = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    setFormData(prev => ({ ...prev, skills }));
    validateField('skills', skills);
  };

  

  const isFormValid = () => {
    const hasErrors = Object.values(errors).some(err => err);
    const hasEmptyFields = Object.values(formData).some(val => {
      if (typeof val === 'string') return !val.trim();
      if (Array.isArray(val)) return val.length === 0;
      return !val;
    });
    return !hasErrors && !hasEmptyFields;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (editIndex !== null) {
      updateUser(editIndex, formData);
      toast.success('User updated successfully');
    } else {
      addUser(formData);
      toast.success('User added successfully');
    }

    setFormData(initialState);
    setSelectedCountry('');
    setSelectedState('');
    setCities([]);
    setStates([]);
    setErrors({});
  };

  // Fetch country, states, cities
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://api.countrystatecity.in/v1/countries', {
          headers: { 'X-CSCAPI-KEY': 'cWJydkoxOHBOV0ZwaHFPZ1U4T013WjBOWExlR2k2aVhwSkFWcXJ4Vg==' }
        });
        setCountry(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const fetchStates = async () => {
        try {
          const res = await axios.get(`https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`, {
            headers: { 'X-CSCAPI-KEY': 'cWJydkoxOHBOV0ZwaHFPZ1U4T013WjBOWExlR2k2aVhwSkFWcXJ4Vg==' }
          });
          setStates(res.data);
          setCities([]);
        } catch (err) {
          console.error(err);
        }
      };
      fetchStates();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const fetchCities = async () => {
        try {
          const res = await axios.get(`https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${selectedState}/cities`, {
            headers: { 'X-CSCAPI-KEY': 'cWJydkoxOHBOV0ZwaHFPZ1U4T013WjBOWExlR2k2aVhwSkFWcXJ4Vg==' }
          });
          setCities(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCities();
    }
  }, [selectedState, selectedCountry]);

  console.log(formData)

  return (
    <form className="form" onSubmit={handleSubmit}>
      {formFields.map(({ name, type, placeholder }) => {
        if (name === 'skills') {
          return (
            <div key={name} className="form-group">
              <label htmlFor={name}>{placeholder}</label>
              <Select
                id={name}
                name={name}
                isMulti
                options={skillOptions}
                value={formData.skills.map(skill => ({ value: skill, label: skill }))}
                onChange={handleSkillChange}
                className="multi-select"
                placeholder="Select Skills"
              />
              {errors.skills && <span className="error">{errors.skills}</span>}
            </div>
          );
        } else if (type === 'select') {
          return (
            <div key={name} className="form-group">
              <label htmlFor={name}>{placeholder}</label>
              <select
                id={name}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className={errors[name] ? 'invalid' : ''}
              >
                <option value="">Select {placeholder}</option>
                {(name === 'country' ? country : name === 'state' ? states : name === 'city' ? cities : options || []).map((opt) => (
                  <option key={opt.iso2 || opt.value} value={opt.iso2 || opt.value}>
                    {opt.name || opt.label}
                  </option>
                ))}
              </select>
              {errors[name] && <span className="error">{errors[name]}</span>}
            </div>
          );
        } 
        else if (type === 'radio') {
         const options=['Male', 'Female', 'Other']
          return (
            <div key={name} className="form-group">
              <label>Gender:</label>
        <div className="radio-group">
          {options.map(gender => (
            <label key={gender}>
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData.gender === gender}
                onChange={handleChange}
              /> {gender}
            </label>
                ))}
              </div>
              {errors[name] && <span className="error">{errors[name]}</span>}
            </div>
          );
        }
        else if (type === 'textarea') {
          return (
            <div key={name} className="form-group">
              <textarea
                name={name}
                placeholder={placeholder}
                value={formData[name] || ""}
                onChange={handleChange}
              />
            </div>
          );
        } else if (type === 'checkbox') {
          return (
            <div key={name} className="form-group">
              <label>
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name] || false}
                  onChange={handleChange}
                />
                {placeholder}
              </label>
            </div>
          );
        } else {
          return (
            <div key={name} className="form-group">
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name] || ""}
                onChange={handleChange}
                className={errors[name] ? 'invalid' : ''}
              />
              {errors[name] && <span className="error">{errors[name]}</span>}
            </div>
          );
        }
      })}
      
      <button type="submit" className="submit-button"
      disabled={!isFormValid()}
      style={{ backgroundColor: !isFormValid() ? "#ccc" : "#007bff", cursor: !isFormValid() ? "not-allowed" : "pointer" }}
      >
       {editIndex !== null ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default UserForm;
