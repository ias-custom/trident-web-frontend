import {
    GET_ROLES
  } from '../actionTypes';
  
  const initialState = {
    roles: []
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case GET_ROLES:
        return {...state, roles: action.payload};
        
      default:
        return state;
  
    }
  }