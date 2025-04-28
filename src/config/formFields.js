const formFields = [
  // checkbox: true, options:{
  //   [
  //   ]
  // }
  { name: "fullName", type: "text", placeholder: "Full Name" },
  { name: "email", type: "email", placeholder: "Email" },
  { name: "alternateEmail", type: "email", placeholder: "Alternate Email" },
  { name: "phone", type: "text", placeholder: "Phone" },
  { name: "emergencyContact", type: "text", placeholder: "Emergency Contact" },
  { name: "address", type: "text", placeholder: "Address" },
  { name: "company", type: "text", placeholder: "Company" },
  { name: "experience", type: "number", placeholder: "Years of Experience" },
  { name: "zip", type: "text", placeholder: "Zip Code" },
  { name: "dob", type: "date", placeholder: "Date of Birth" },
  { name: "bio", type: "textarea", placeholder: "Short Bio" },
  {name:"jobTitle", type:"text", placeholder:"Enter job title"},
  {name:"skills", type:"skills", placeholder:"Select Skills"},
  {name:"gender", type:"radio", placeholder:"Select gender"}, //radio
  {name:"country", type:"select", placeholder:"Select Country"},
  {name:"state", type:"select", placeholder:"Select State"},
  {name:"city", type:"select", placeholder:"Select City"},


  
];

export default formFields;