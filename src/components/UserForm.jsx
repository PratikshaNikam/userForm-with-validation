import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import './UserForm.css';
import Select from 'react-select';
import formFields from '../config/formFields';
import skillOptions from '../config/skillOptions';  // Make sure this import is correct
import initialState from '../config/initialState';
import axios from 'axios';
import validateField from '../utils/validation';
import InputField from './InputField';  // Import InputField component

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

  return (
    <form className="form" onSubmit={handleSubmit}>
      {formFields.map(({ name, type, placeholder }) => {
        switch (type) {
          case 'select':
            return (
              <InputField
                key={name}
                type="select"
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                error={errors[name]}
                options={name === 'country' ? country : name === 'state' ? states : name === 'city' ? cities : []}
              />
            );
          case 'radio':
            const genderOptions = ['Male', 'Female', 'Other'];
            return (
              <InputField
                key={name}
                type="radio"
                name={name}
                placeholder="Gender"
                value={formData[name]}
                onChange={handleChange}
                error={errors[name]}
                options={genderOptions}
              />
            );
          case 'skills':
            return (
              <InputField
                key={name}
                type="multi-select"
                name={name}
                placeholder={placeholder}
                value={formData.skills || []}
                onChange={handleSkillChange}
                error={errors[name]}
                options={skillOptions}  // Pass skill options here
                isMulti={true}  // Ensure multi-select is enabled
              />
            );
          default:
            return (
              <InputField
                key={name}
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                error={errors[name]}
              />
            );
        }
      })}
      <button type="submit" className="submit-button"
        disabled={!isFormValid()}
        style={{ backgroundColor: !isFormValid() ? "#ccc" : "#007bff", cursor: !isFormValid() ? "not-allowed" : "pointer" }}>
        {editIndex !== null ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default UserForm;
