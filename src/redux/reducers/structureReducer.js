import { GET_STRUCTURES, GET_STRUCTURE_TYPES, GET_PHOTOS, GET_INTERACTIONS } from "../actionTypes";

const initialState = {
  structures: [],
  structureTypes: [],
  photos: [],
  interactions: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_STRUCTURES:
      return { ...state, structures: action.payload };

    case GET_STRUCTURE_TYPES:
      return {...state, structureTypes: action.payload};

    case GET_PHOTOS:
      return {...state, photos: action.payload};

    case GET_INTERACTIONS:
      return {...state, interactions: action.payload};
      
    default:
      return state;
  }
};
