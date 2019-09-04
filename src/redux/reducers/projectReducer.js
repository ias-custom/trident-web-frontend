import { GET_PROJECTS, GET_SPANS, GET_TAGS, GET_USERS_PROJECT, GET_PROJECT, GET_SPAN_TYPES, GET_INSPECTIONS_PROJECT, GET_CATEGORIES_PROJECT, SET_CATEGORIES_EMPTY, GET_CATEGORIES_INSPECTION } from "../actionTypes";

const initialState = {
  projects: [],
  project: null,
  spans: [],
  tags: [],
  users: [],
  spanTypes: [],
  inspections: [],
  categories_project: [],
  categoriesInspection: []
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

    case GET_CATEGORIES_PROJECT:
      const categories = state.categories_project.concat(action.payload)
      return {...state, categories_project: categories };

    case SET_CATEGORIES_EMPTY:
      return {...state, categories_project: [] };

    case GET_CATEGORIES_INSPECTION:
      return {...state, categoriesInspection: action.payload };

    default:
      return state;
  }
};
