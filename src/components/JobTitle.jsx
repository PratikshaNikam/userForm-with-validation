import React, { useState } from 'react';

const jobTitles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UI/UX Designer",
    "Product Manager",
    "Project Manager",
    "DevOps Engineer",
    "Data Scientist",
    "Data Analyst",
    "Machine Learning Engineer",
    "Mobile App Developer",
    "Web Developer",
    "Graphic Designer",
    "Quality Assurance Engineer",
    "System Administrator",
    "Cloud Architect",
    "Technical Support Engineer",
    "Business Analyst",
    "IT Manager",
    "Network Engineer",
    "Cybersecurity Analyst",
    "Database Administrator",
    "Digital Marketing Specialist",
    "SEO Specialist",
    "Content Strategist",
    "Social Media Manager",
    "Technical Writer",
    "HR Manager",
    "Recruiter",
    "Sales Manager",
    "Account Manager",
    "Customer Success Manager",
    "Financial Analyst",
    "Marketing Manager",
    "Operations Manager",
    "Legal Advisor",
    "Software Tester",
    "Automation Engineer",
    "Blockchain Developer",
    "AR/VR Developer",
    "Embedded Systems Engineer",
    "Game Developer",
    "Teacher",
    "Doctor",
    "Other"
  ];
  

const JobTitleAutocomplete = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    if (inputValue.length === 0) {
      setSuggestions([]);
    } else {
      const filteredSuggestions = jobTitles.filter((title) =>
        title.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSelect = (title) => {
    onChange(title);
    setSuggestions([]);
  };

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Enter job title"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((title, idx) => (
            <li key={idx} onClick={() => handleSelect(title)}>
              {title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobTitleAutocomplete;
