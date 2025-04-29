// context/UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const addUser = (user) => {
    setUsers((prev) => [...prev, user]);
  };

  const updateUser = (index, updatedUser) => {
    const updatedUsers = [...users];
    updatedUsers[index] = updatedUser;
    setUsers(updatedUsers);
  };

  const deleteUser = (index) => {
    setUsers(prev => prev.filter((_, i) => i !== index));
    setEditIndex(null);  // Reset edit mode
  };

  return (
    <UserContext.Provider 
    value={{ users, addUser, updateUser, editIndex, setEditIndex, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};