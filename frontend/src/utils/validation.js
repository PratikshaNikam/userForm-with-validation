// src/utils/validation.js

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
  
    return error;
  };
  
  export default validateField;
  