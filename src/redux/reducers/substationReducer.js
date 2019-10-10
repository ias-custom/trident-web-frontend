import { GET_SUBSTATIONS, DELETE_SUBSTATION } from "../actionTypes";

const initialState = {
  list: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SUBSTATIONS:
      return {
        ...state,
        list: action.payload,
        errors: []
      };

    case DELETE_SUBSTATION:
      const list = state.list.filter(({ id }) => id !== action.payload);
      return {
        ...state,
        list: list,
        errors: []
      };

    default:
      return state;
  }
};
