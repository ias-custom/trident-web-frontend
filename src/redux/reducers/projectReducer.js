import { GET_PROJECTS, GET_SPANS, GET_TAGS, GET_USERS_PROJECT, GET_PROJECT, GET_SPAN_TYPES } from "../actionTypes";

const initialState = {
  projects: [],
  project: null,
  spans: [],
  tags: [],
  users: [],
  spanTypes: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECT:
      return { ...state, project: action.payload };

    case GET_PROJECTS:
      return { ...state, projects: action.payload };

    case GET_SPANS:
      return { ...state, spans: action.payload };

    case GET_TAGS:
      return { ...state, tags: action.payload };

    case GET_USERS_PROJECT:
      return { ...state, users: action.payload };

    case GET_SPAN_TYPES:
      return {...state, spanTypes: action.payload};
    default:
      return state;
  }
};
