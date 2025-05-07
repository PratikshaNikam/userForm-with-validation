import { useParams } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import UserForm from '../components/UserForm/UserForm';
import { setEditIndex } from '../redux/features/userSlice';
import { useDispatch } from 'react-redux';

const EditUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  

  useEffect(() => {
    dispatch(setEditIndex(Number(id)));
  }, [id,dispatch]);

  return <UserForm/>;
};

export default EditUser;
