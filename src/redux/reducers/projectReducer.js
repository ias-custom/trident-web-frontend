import { GET_PROJECTS, GET_STRUCTURES, GET_SPAMS } from "../actionTypes";

const initialState = {
  projects: [],
  structures: [],
  spams: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECTS:
      return { ...state, projects: action.payload };

    case GET_STRUCTURES:
      return { ...state, structures: action.payload };

    case GET_SPAMS:
      return { ...state, spams: action.payload };

    default:
      return state;
  }
};
