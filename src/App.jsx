// App.js
import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import EditUser from './Pages/EditUser';

const App = () => {
  return (

    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
        </Routes>
      </Router>

    </>
  );
};

export default App;
