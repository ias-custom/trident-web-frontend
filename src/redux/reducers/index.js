import { combineReducers } from "redux";
import globalReducer from './globalReducer';
import userReducer from './userReducer';
import authReducer from './authReducer';
import layoutReducer from './layoutReducer';
import customerReducer from './customerReducer';

export default combineReducers({
  global: globalReducer,
  auth: authReducer,
  users: userReducer,
  layout: layoutReducer,
  customers: customerReducer
});
