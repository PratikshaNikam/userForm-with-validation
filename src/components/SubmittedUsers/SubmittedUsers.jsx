// components/SubmittedUsers.js
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SubmittedUsers.css';

const SubmittedUsers = () => {
  const { users, deleteUser, setEditIndex, setIsFormVisible } = useContext(UserContext);
  const navigate = useNavigate();

  const handleEdit = (index) => {
    setEditIndex(index);  // Set the edit index for editing
    toast.info("Editing user");
    navigate(`/edit-user/${index}`);
    setIsFormVisible(true);

  };

  const handleDelete = (index) => {
    // Confirm before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      deleteUser(index);  // Call deleteUser to remove user from the list
      toast.success("User deleted successfully");
    }
  };

  const handleFinalSubmit = () => {
    const confirm = window.confirm("Are you sure you want to submit all users?");
    if (confirm) {
      toast.success("All users submitted successfully!");
      // will add code to send data to backend API here 
    }
  };

  return (
    <>
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

      <div className="submit-all-container">
        <button onClick={handleFinalSubmit} className="submit-btn">
          Submit All
        </button>
      </div>

    </>
  );
};

export default SubmittedUsers;
