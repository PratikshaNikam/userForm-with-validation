import React,{useContext} from 'react';
import UserForm from '../components/UserForm/UserForm';
import SubmittedUsers from '../components/SubmittedUsers/SubmittedUsers';
import { UserContext } from '../context/UserContext';
import "./Home.css";


const Home = () => {
  //const { isFormVisible } = useContext(UserContext);
 // console.log(isFormVisible)
  return (
    <>
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
    </>
  );
};

export default Home;
