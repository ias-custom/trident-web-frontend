import { GET_INTERACTIONS, DELETE_INTERACTION } from "../actionTypes";

const initialState = {
  list: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_INTERACTIONS:
      return { ...state, list: action.payload };

    case DELETE_INTERACTION:
      return {
        ...state,
        list: state.list.filter(({ id }) => id !== action.payload)
      };

    default:
      return state;
  }
};
