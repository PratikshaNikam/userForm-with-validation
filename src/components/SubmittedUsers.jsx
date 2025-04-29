// components/SubmittedUsers.js
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import './UserForm.css';
import './SubmittedUsers.css';

const SubmittedUsers = () => {
  const { users, deleteUser, setEditIndex } = useContext(UserContext);

  const handleEdit = (index) => {
    setEditIndex(index);  // Set the edit index for editing
    toast.info("Editing user");
  };

  const handleDelete = (index) => {
    // Confirm before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      deleteUser(index);  // Call deleteUser to remove user from the list
      toast.success("User deleted successfully");
    }
  };

  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p>No users submitted yet.</p>
      ) : (
        users.map((user, index) => (
          <div key={index} className="user-card">
            {/* Render user data */}
            {Object.entries(user).map(([key, value]) => (
  <p key={key}>
    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
    {Array.isArray(value) ? value.join(", ") : value || "N/A"}
  </p>
))}
            
            {/* Action buttons */}
            <div className="buttons">
              <button onClick={() => handleEdit(index)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(index)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SubmittedUsers;
