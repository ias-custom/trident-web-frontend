import { combineReducers } from "redux";
import globalReducer from './globalReducer';
import userReducer from './userReducer';
import authReducer from './authReducer';
import layoutReducer from './layoutReducer';
import customerReducer from './customerReducer';
import projectReducer from './projectReducer';
import roleReducer from './roleReducer';
import structureReducer from "./structureReducer";
import spanReducer from "./spanReducer";
import substationsReducer from "./substationReducer";
import setReducer from "./setReducer";

export default combineReducers({
  global: globalReducer,
  auth: authReducer,
  users: userReducer,
  layout: layoutReducer,
  customers: customerReducer,
  projects: projectReducer,
  roles: roleReducer,
  structures: structureReducer,
  spans: spanReducer,
  substations: substationsReducer,
  sets: setReducer
});
