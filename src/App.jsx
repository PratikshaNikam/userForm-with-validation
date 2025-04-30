// App.js
import React from 'react';
import './App.css';
import { UserProvider } from './context/UserContext';
import UserForm from './components/UserForm/UserForm';
import SubmittedUsers from './components/SubmittedUsers/SubmittedUsers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
 
const App = () => {
  return (
    <UserProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container">
        <div className="form-section">
          <h2>User Information Form</h2>
          <UserForm />
        </div>
        <div className="data-section">
          <h2>Submitted Users</h2>
          <SubmittedUsers />
        </div>
      </div>
    </UserProvider>
  );
};

export default App;
