import {
    GET_CUSTOMERS,
    GET_CUSTOMER_SELECTED,
    HANDLE_FORM,
  } from '../actionTypes';

const customersStorage = JSON.parse(localStorage.getItem('customers'));
const customerSelectedIdStorage = parseInt(JSON.parse(localStorage.getItem('customerSelectedId')));
const initialState = {
  customers: customersStorage,
  customerSelectedId: customerSelectedIdStorage
};
  
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMERS:
      return {...state, customers: action.payload};

    case HANDLE_FORM:
      return { ...state, handleForm: action.handleForm};
      
    case GET_CUSTOMER_SELECTED:
      return {...state, customerSelectedId: action.payload}
      
    default:
      return state;

  }
}