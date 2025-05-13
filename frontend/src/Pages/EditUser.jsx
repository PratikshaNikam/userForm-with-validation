import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserForm from '../components/UserForm/UserForm';

const EditUser = () => {
  const { id } = useParams();
  const { users } = useSelector((state) => state.user);
  const userIndex = Number(id);
  const initialData = users[userIndex];

  if (!initialData) return <div>User not found</div>;

  return <UserForm initialData={initialData} userIndex={userIndex} />;
};

export default EditUser;
