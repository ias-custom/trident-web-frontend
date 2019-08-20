import {
    GET_CUSTOMERS,
    HANDLE_FORM,
    SET_CURRENT_FORM,
    SET_CUSTOMERS,
    SET_CUSTOMER_SELECTED
  } from '../actionTypes';
  
  const initialState = {
    customers: []
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case GET_CUSTOMERS:
        return {...state, customers: action.payload};
  
      case HANDLE_FORM:
        return { ...state, handleForm: action.handleForm};
  
      case SET_CURRENT_FORM:
        return { ...state, currentForm: action.currentForm};
  
      case SET_CUSTOMERS:
        return {...state, customers: action.payload, customerSelectedId: action.payload[0].id}
      
      case SET_CUSTOMER_SELECTED:
        return {...state, customerSelectedId: action.payload}
        
      default:
        return state;
  
    }
  }