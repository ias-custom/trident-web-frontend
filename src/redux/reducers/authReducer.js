import {
  LOGIN,
  LOGIN_ERROR,
  LOGOUT,
  REFRESH_TOKEN,
} from "../actionTypes";

const authStorage = JSON.parse(localStorage.getItem('auth'));

const defaultState = {
  id: 0,
  fullName: '',
  username: '',
  avatar: 'RE',
  token: null
};

const initialState = {...defaultState, ...authStorage};

export default (state = initialState, action) => {
  switch (action.type) {

    case LOGIN:
      return {
        ...state,
        ...action.payload,
      };

    case LOGIN_ERROR:
      return {
        ...state
      };

    case REFRESH_TOKEN:
      return {
        ...state,
        ...action.payload
      };


    case LOGOUT:
      return defaultState;

    default:
      return state;
  }

}