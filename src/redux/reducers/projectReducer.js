import {
  GET_PROJECTS,
  GET_SPANS,
  GET_TAGS,
  GET_USERS_PROJECT,
  GET_PROJECT,
  GET_SPAN_TYPES,
  GET_INSPECTIONS_PROJECT,
  GET_CATEGORIES_PROJECT,
  SET_CATEGORIES_EMPTY,
  GET_CATEGORIES_INSPECTION,
  GET_DEFICIENCIES,
  GET_MARKINGS_TYPES,
  GET_ACCESS_TYPES,
  GET_ACCESS_TYPE_DETAILS,
  SET_LATITUDE,
  SET_LONGITUDE,
  LOADED_CATEGORIES,
  SET_FROM_MAP,
  SET_PROJECT_FOR_MAP
} from "../actionTypes";

const initialState = {
  projects: [],
  project: null,
  spans: [],
  tags: [],
  users: [],
  spanTypes: [],
  inspections: [],
  categories_project: [],
  categoriesInspection: [],
  deficiencies: [],
  marking_types: [],
  access_types: [],
  details: [],
  latitude: "",
  longitude: "",
  loadedCategories: false,
  fromMap: false,
  id: ""
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
      return { ...state, spanTypes: action.payload };

    case GET_INSPECTIONS_PROJECT:
      return { ...state, inspections: action.payload };

    case GET_CATEGORIES_PROJECT:
      const categories = state.categories_project.concat(action.payload);
      return { ...state, categories_project: categories };

    case SET_CATEGORIES_EMPTY:
      return { ...state, categories_project: [] };

    case GET_CATEGORIES_INSPECTION:
      return { ...state, categoriesInspection: action.payload };

    case GET_DEFICIENCIES:
      return { ...state, deficiencies: action.payload };
      
    case GET_MARKINGS_TYPES:
      return { ...state, marking_types: action.payload };

    case GET_ACCESS_TYPES:
      return { ...state, access_types: action.payload };
      
    case GET_ACCESS_TYPE_DETAILS:
      return { ...state, details: action.payload };

    case SET_LATITUDE:
      return { ...state, latitude: action.payload };

    case SET_LONGITUDE:
      return { ...state, longitude: action.payload };

    case SET_FROM_MAP:
      return { ...state, fromMap: action.payload };

    case SET_PROJECT_FOR_MAP:
      return { ...state, id: action.payload };
      
    case LOADED_CATEGORIES:
      return { ...state, loadedCategories: action.payload };

    default:
      return state;
  }
};
