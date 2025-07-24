import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import postReducer from './slices/postSlice';

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer
});

export default rootReducer;
