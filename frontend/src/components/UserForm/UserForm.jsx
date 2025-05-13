import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './UserForm.css';
import jobTitles from '../../config/jobTitles';
import formFields from '../../config/formFields';
import skillOptions from '../../config/skillOptions';
import initialState from '../../config/initialState';
import validateField from '../../utils/validation';
import InputField from '../SharedComponent/InputField';
import CountryStateCity from '../Hooks/UseCountryStateCity';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_USER_REQUEST, UPDATE_USER_REQUEST } from '../../redux/sagas/types';

const UserForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const { countries, states, cities } = CountryStateCity(selectedCountry, selectedState);

  const genderOptions = ['Male', 'Female', 'Other'];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const users = useSelector((state) => state.user.users);

  useEffect(() => {
    if (id) {
      const userToEdit = users.find((user) => user.id === Number(id));
      if (userToEdit) {
        setFormData(userToEdit);
        setSelectedCountry(userToEdit.country);
        setSelectedState(userToEdit.state);
      }
    } else {
      setFormData(initialState);
    }
  }, [id, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'country') {
      setSelectedCountry(value);
      setFormData((prev) => ({ ...prev, country: value, state: '', city: '' }));
    }
    if (name === 'state') {
      setSelectedState(value);
      setFormData((prev) => ({ ...prev, state: value, city: '' }));
    }

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSkillChange = (selectedOptions) => {
    const skills = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFormData((prev) => ({ ...prev, skills }));
    const error = validateField('skills', skills);
    setErrors((prev) => ({ ...prev, skills: error }));
  };

  const isFormValid = () => {
    const hasErrors = Object.values(errors).some((err) => err);
    const hasEmptyFields = Object.values(formData).some((val) => {
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

    if (id) {
      dispatch({
        type: UPDATE_USER_REQUEST,
        payload: {
          id: Number(id),
          updatedData: formData,
        },
      });
      toast.success('User updated successfully');
    } else {
      dispatch({ type: ADD_USER_REQUEST, payload: formData });
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
          case 'select': {
            const selectOptions =
              name === 'country'
                ? countries
                : name === 'state'
                ? states
                : name === 'city'
                ? cities
                : name === 'jobTitle'
                ? jobTitles
                : [];
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
          }
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
                isMulti={true}
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
          backgroundColor: !isFormValid() ? '#ccc' : '#45a049',
          cursor: !isFormValid() ? 'not-allowed' : 'pointer',
        }}
      >
        {id ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default UserForm;
