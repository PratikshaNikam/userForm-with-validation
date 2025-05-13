import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';

import {
 ADD_USER_REQUEST,DELETE_USER_REQUEST,UPDATE_USER_REQUEST} from './types';

import {addUserSuccess,addUserFailure,updateUserSuccess,updateUserFailure,
  deleteUserSuccess,deleteUserFailure} from "../features/userSlice";

function* addUserSaga(action) {
  try {
    const response = yield call(axios.post, 'http://localhost:5000/api/users', action.payload);
    yield put(addUserSuccess(response.data));
  } catch (error) {
    yield put(addUserFailure(error.message));
  }
}

function* deleteUserSaga(action) {
  try {
    yield call(() => axios.delete(`http://localhost:5000/users/${action.payload}`));
    yield put(deleteUserSuccess(action.payload));
  } catch (error) {
    yield put(deleteUserFailure(error.message));
  }
}

function* updateUserSaga(action) {
  try {
    const { id, updatedUser } = action.payload;
    const response = yield call(() =>
      axios.put(`http://localhost:5000/users/${id}`, updatedUser)
    );
    yield put(updateUserSuccess(response.data));
  } catch (error) {
    yield put(updateUserFailure(error.message));
  }
}

export default function* userSaga() {
  yield all([
    takeLatest(ADD_USER_REQUEST, addUserSaga),
    takeLatest(DELETE_USER_REQUEST, deleteUserSaga),
    takeLatest(UPDATE_USER_REQUEST, updateUserSaga),
  ]);
}
