import {
  GET_ROLES,
  GET_US_STATES,
  ON_LOADING,
  ENQUEUE_SNACKBAR,
  REMOVE_SNACKBAR,
  HANDLE_FORM,
  SET_CURRENT_FORM,
  SET_CUSTOMERS,
  SET_CUSTOMER_SELECTED
} from '../actionTypes';

const customersStorage = JSON.parse(localStorage.getItem('customers'));
const customerSelectedIdStorage = parseInt(JSON.parse(localStorage.getItem('customerSelectedId')));
const initialState = {
  loading: false,
  handleForm: false,
  currentForm: null,
  notifications: [],
  us_states: [],
  roles: [],
  patientTags: [],
  productTypes: [],
  productCategories: [],
  customers: customersStorage,
  customerSelectedId: customerSelectedIdStorage
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_LOADING:
      return {...state, loading: action.loading};

    case HANDLE_FORM:
      return { ...state, handleForm: action.handleForm};

    case SET_CURRENT_FORM:
      return { ...state, currentForm: action.currentForm};

    case ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.notification,
          },
        ],
      };

    case REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.key !== action.key,
        ),
      };

    case GET_US_STATES:
      return {...state, us_states: action.payload};

    case GET_ROLES:
      return {...state, roles: action.payload};
    
    case SET_CUSTOMERS:
      return {...state, customers: action.payload, customerSelectedId: action.payload[0].id}
    
    case SET_CUSTOMER_SELECTED:
      return {...state, customerSelectedId: action.payload}
      
    default:
      return state;

  }
}