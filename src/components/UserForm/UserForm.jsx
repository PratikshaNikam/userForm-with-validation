import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './UserForm.css';
import jobTitles from '../../config/jobTitles';
import formFields from '../../config/formFields';
import skillOptions from '../../config/skillOptions';
import initialState from '../../config/initialState';
import validateField from '../../utils/validation';
import InputField from '../SharedComponent/InputField';
import UseCountryStateCity from '../Hooks/UseCountryStateCity';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '../../redux/features/userSlice';

const UserForm = ({ initialData = initialState, userIndex = null }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(initialData.country || '');
  const [selectedState, setSelectedState] = useState(initialData.state || '');
  const { countries, states, cities } = UseCountryStateCity(selectedCountry, selectedState);

  const genderOptions = ['Male', 'Female', 'Other'];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //console.log(formData)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedCountry(initialData.country || '');
      setSelectedState(initialData.state || '');
    } else {
      setFormData(initialState);
    }
  }, [initialData]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      setSelectedCountry(value);
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    }
    if (name === 'state') {
      setSelectedState(value);
      setFormData(prev => ({ ...prev, city: '' }));
    }

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSkillChange = (selectedOptions) => {
    const skills = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    setFormData(prev => ({ ...prev, skills }));
    const error = validateField('skills', skills);
    setErrors(prev => ({ ...prev, skills: error }));
  };

  const isFormValid = () => {
    const hasErrors = Object.values(errors).some(Boolean);
    const hasEmpty = Object.entries(formData).some(([key, val]) => {
      if (typeof val === 'string') return !val.trim();
      if (Array.isArray(val)) return val.length === 0;
      return !val;
    });
    return !hasErrors && !hasEmpty;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (userIndex !== null) {
      dispatch(updateUser({ index: userIndex, updatedUser: formData }));
      toast.success('User updated successfully');
    } else {
      dispatch(addUser(formData));
      toast.success('User added successfully');
    }

    setFormData(initialState);
    setSelectedCountry('');
    setSelectedState('');
    setErrors({});


    navigate('/');
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {formFields.map(({ name, type, placeholder }) => {
        switch (type) {
          case 'select':
            const selectOptions =
              name === 'country' ? countries :
              name === 'state' ? states :
              name === 'city' ? cities :
              name === 'jobTitle' ? jobTitles : [];
            return (
              <InputField
                key={name}
                type="select"
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                error={errors[name]}
                options={selectOptions}
              />
            );
          case 'radio':
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
                options={skillOptions}
                isMulti
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
      <button
        type="submit"
        className="submit-btn"
        disabled={!isFormValid()}
        style={{
          backgroundColor: !isFormValid() ? "#ccc" : "#45a049",
          cursor: !isFormValid() ? "not-allowed" : "pointer"
        }}
      >
        {userIndex !== null ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default UserForm;
