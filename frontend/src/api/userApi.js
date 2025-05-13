import axios from 'axios';

export const createUserApi = async (userData) => {
  const res = await axios.post('http://localhost:5000/api/users', userData);
  return res.data;
};
