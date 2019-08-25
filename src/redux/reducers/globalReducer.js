import {
  GET_ROLES,
  ON_LOADING,
  ENQUEUE_SNACKBAR,
  REMOVE_SNACKBAR,
  HANDLE_FORM,
  SET_CURRENT_FORM
} from '../actionTypes';

const initialState = {
  loading: false,
  handleForm: false,
  currentForm: null,
  notifications: []
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

    case GET_ROLES:
      return {...state, roles: action.payload};
      
    default:
      return state;

  }
}