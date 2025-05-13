import { ADD_USER_REQUEST, DELETE_USER_REQUEST } from '../sagas/types';

export const addUserRequest = (user) => ({
  type: ADD_USER_REQUEST,
  payload: user,
});

export const deleteUserRequest = (id) => ({
  type: DELETE_USER_REQUEST,
  payload: id,
});

