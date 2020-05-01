import {
  ON_LOADING,
  ENQUEUE_SNACKBAR,
  REMOVE_SNACKBAR,
  HANDLE_FORM,
  SET_CURRENT_FORM,
  GET_STATES,
  GET_ITEM_STATES,
  GET_STATISTICS
} from '../actionTypes';

const initialState = {
  loading: false,
  handleForm: false,
  currentForm: null,
  notifications: [],
  states: [],
  item_states: [],
  statistics: {
    projects: {
      active: 0,
      planned: 0,
      completed: 0
    },
    structures: {
      total_collected: 0,
      with_out_deficiencies: 0,
      with_deficiencies: 0,
    },
    deficiencies: {
      total_recorded_for_structures: 0,
      total_recorded_for_spans: 0
    },
    interactions: {
      positive: 0,
      negative: 0
    }
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_STATISTICS:
      return {...state, statistics: action.payload};

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

    case GET_STATES:
      return {...state, states: action.payload};

    case GET_ITEM_STATES:
      return {...state, item_states: action.payload};

      
    default:
      return state;

  }
}