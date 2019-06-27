import {
  CREATE_USER, CREATE_USER_ERROR, DELETE_USER, GET_USER,
  GET_USERS,
  GET_USERS_ERROR, UPDATE_USER, UPDATE_USER_ERROR
} from '../actionTypes';

const initialState = {
  list: [],
  user: {
    id: 0
  },
  errors: {}
};

export default (state = initialState, action) => {

  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        list: action.payload,
        errors: []
      };

    case GET_USERS_ERROR:
      return {
        ...state,
        list: [],
        errors: action.payload
      };

    case CREATE_USER:
      return {
        ...state,
        user: action.payload,
        errors: []
      };

    case CREATE_USER_ERROR:
      return {
        ...state,
        errors: action.payload
      };

    case UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };

    case UPDATE_USER_ERROR:
      return {
        ...state,
        errors: action.payload
      };

    case GET_USER:
      return {
        ...state,
        user: action.payload
      };

    case DELETE_USER:
      return {
        ...state,
        list: state.list.filter(user => user.id !== action.id)
      };

    default:
      return state;
  }
};