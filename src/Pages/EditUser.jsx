import { useParams } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import UserForm from '../components/UserForm/UserForm';

const EditUser = () => {
  const { id } = useParams();
  const { setEditIndex } = useContext(UserContext);

  useEffect(() => {
    setEditIndex(Number(id));
  }, [id]);

  return <UserForm/>;
};

export default EditUser;
