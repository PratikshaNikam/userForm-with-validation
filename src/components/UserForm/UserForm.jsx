import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { toast } from 'react-toastify';
import './UserForm.css';
import jobTitles from '../../config/jobTitles';
import formFields from '../../config/formFields';
import skillOptions from '../../config/skillOptions'; 
import initialState from '../../config/initialState';
import validateField from '../../utils/validation';
import InputField from '../SharedComponent/InputField';  
import CountryStateCity from '../Hooks/UseCountryStateCity';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, updateUser, clearEditIndex } from '../../redux/features/userSlice';

const UserForm = () => {
  //const { users, addUser, editIndex, updateUser, } = useContext(UserContext);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const { countries, states, cities } = CountryStateCity(selectedCountry, selectedState);
  //const { countries, states, cities } = UseCountryStateCity(selectedCountryCode, selectedStateCode);

  const genderOptions = ['Male', 'Female', 'Other'];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, editIndex } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (editIndex !== null && users[editIndex]) {
      setFormData(users[editIndex]);
    } else {
      setFormData(initialState); 
    }
  }, [editIndex, users]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'country') {
      setSelectedCountry(value);
      setFormData(prev => ({ ...prev, country: value, state: '', city: '' }));
    }
    if (name === 'state') {
      setSelectedState(value);
      setFormData(prev => ({ ...prev, state: value, city: '' }));
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
      //updateUser(editIndex, formData);
      dispatch(updateUser({ index: editIndex, updatedUser: formData }));
      toast.success('User updated successfully');
      navigate('/');
    } else {
      //addUser(formData);
      dispatch(addUser(formData));
      toast.success('User added successfully');
    }
    setFormData(initialState);
    setSelectedCountry('');
    setSelectedState('');
    setErrors({});
  };
  
  return (
    <form className="form" onSubmit={handleSubmit}>
      {formFields.map(({ name, type, placeholder }) => {
        switch (type) {
          case 'select':
            const selectOptions =
              name === 'country'? countries : name === 'state' ? states : name === 'city' ? cities : 
              name === 'jobTitle'? jobTitles : [];
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
                options={ skillOptions }  // Pass skill options here
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
      <button type="submit" className="submit-btn"
        disabled={!isFormValid()}
        style={{ backgroundColor: !isFormValid() ? "#ccc" : "#45a049", cursor: !isFormValid() ? "not-allowed" : "pointer" }}>
        {editIndex !== null ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default UserForm;
