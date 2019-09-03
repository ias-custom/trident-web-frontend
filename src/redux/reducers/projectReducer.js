import { GET_PROJECTS, GET_SPANS, GET_TAGS, GET_USERS_PROJECT, GET_PROJECT, GET_SPAN_TYPES, GET_INSPECTIONS_PROJECT, GET_CATEGORIES_INSPECTION, SET_CATEGORIES_EMPTY } from "../actionTypes";

const initialState = {
  projects: [],
  project: null,
  spans: [],
  tags: [],
  users: [],
  spanTypes: [],
  inspections: [],
  categories: []
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

    case GET_INSPECTIONS_PROJECT:
      return {...state, inspections: action.payload};

    case GET_CATEGORIES_INSPECTION:
      const categories = state.categories.concat(action.payload)
      return {...state, categories: categories };

    case SET_CATEGORIES_EMPTY:
      return {...state, categories: [] };

    default:
      return state;
  }
};
