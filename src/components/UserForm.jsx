import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import './UserForm.css';
import JobTitleAutocomplete from './JobTitle';
import Select from 'react-select';
import formFields from '../config/formFields';
import skillOptions from '../config/skillOptions';
import initialState from '../config/initialState';
import axios from 'axios';

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
    }
  }, [editIndex, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (!/^[a-zA-Z\s]{2,50}$/.test(value)) error = 'Name must be 2–50 letters';
        break;
      case 'email':
      case 'alternateEmail':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email';
        break;
      case 'zip':
        if (!value.trim()) error = 'Zip code is required';
        else if (!/^\d{6}(-\d{4})?$/.test(value)) error = 'Zip must be 6 digits or 5+4';
        break;
      case 'dob':
        if (!value) error = 'Date of birth is required';
        break;
      case 'skills':
        if (!Array.isArray(value) || value.length === 0) error = 'Please enter at least one skill';
        break;
      case 'phone':
      case 'emergencyContact':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Enter a 10-digit number';
        break;
      case 'address':
      case 'city':
      case 'state':
      case 'country':
      case 'company':
      case 'jobTitle':
        if (!value.trim()) error = `${name[0].toUpperCase() + name.slice(1)} is required`;
        break;
      case 'experience':
        if (!value.trim()) error = 'Experience is required';
        else if (isNaN(value) || value < 0 || value > 50) error = 'Enter valid years of experience';
        break;
      case 'bio':
        if (value.length > 250) error = 'Bio must be less than 250 characters';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
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

  const handleSkillChange = (selectedOptions) => {
    const skills = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    setFormData(prev => ({ ...prev, skills }));
    validateField('skills', skills);
  };

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


  //if (!formData) return null;
  return (
    <form className="form" onSubmit={handleSubmit}>
      {formFields.map(({ name, type, placeholder }) => (
        <div key={name} className="form-group">
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            className={errors[name] ? 'invalid' : ''}
          />
          {errors[name] && <span className="error">{errors[name]}</span>}
        </div>
      ))}

      <JobTitleAutocomplete
        value={formData.jobTitle}
        onChange={(value) => {
          setFormData(prev => ({ ...prev, jobTitle: value }));
          validateField('jobTitle', value);
        }}
      />

      <label htmlFor="skills">Select Skills:</label>
      <Select
        id="skills"
        name="skills"
        isMulti
        options={skillOptions}
        value={formData.skills.map(skill => ({ value: skill, label: skill }))}
        onChange={handleSkillChange}
        className="multi-select"
        placeholder="Select Skills"
      />

      <div className="form-group">
        <label>Gender:</label>
        <div className="radio-group">
          {['Male', 'Female', 'Other'].map(gender => (
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
        {errors.gender && <span className="error">{errors.gender}</span>}
      </div>

      <div className="form-group">
        <label>Country:</label>
        <select
          value={selectedCountry}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCountry(value);
            setFormData(prev => ({ ...prev, country: value }));
            validateField('country', value);
          }}
        >
          <option value="">Select Country</option>
          {country.map(c => <option key={c.iso2} value={c.iso2}>{c.name}</option>)}
        </select>
        {errors.country && <span className="error">{errors.country}</span>}
      </div>

      <div className="form-group">
        <label>State:</label>
        <select
          value={selectedState}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedState(value);
            setFormData(prev => ({ ...prev, state: value }));
            validateField('state', value);
          }}
        >
          <option value="">Select State</option>
          {states.map(s => <option key={s.iso2} value={s.iso2}>{s.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>City:</label>
        <select
          value={formData.city}
          onChange={(e) => {
            const value = e.target.value;
            setFormData(prev => ({ ...prev, city: value }));
            validateField('city', value);
          }}
        >
          <option value="">Select City</option>
          {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={!isFormValid()}
        style={{ backgroundColor: !isFormValid() ? "#ccc" : "#007bff", cursor: !isFormValid() ? "not-allowed" : "pointer" }}
      >
        {editIndex !== null ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default UserForm;
