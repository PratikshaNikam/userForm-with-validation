// App.js
import React from 'react';
import './App.css';
import { UserProvider } from './context/UserContext';
import UserForm from './components/UserForm';
import UserForm1 from "./components/UserForm1";
import SubmittedUsers from './components/SubmittedUsers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <UserProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container">
        <div className="form-section">
          <h2>User Information Form</h2>
          <UserForm1 />
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
