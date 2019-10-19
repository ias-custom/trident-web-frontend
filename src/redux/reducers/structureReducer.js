import { GET_STRUCTURES, GET_STRUCTURE_TYPES, GET_PHOTOS, GET_ITEMS_STRUCTURE } from "../actionTypes";

const initialState = {
  structures: [],
  structureTypes: [],
  photos: [],
  items: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_STRUCTURES:
      return { ...state, structures: action.payload };

    case GET_STRUCTURE_TYPES:
      return {...state, structureTypes: action.payload};

    case GET_PHOTOS:
      return {...state, photos: action.payload};

    case GET_ITEMS_STRUCTURE:
      return {...state, items: action.payload};
      
    default:
      return state;
  }
};
