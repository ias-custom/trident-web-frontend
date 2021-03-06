import {
  GET_STRUCTURES,
  GET_STRUCTURE_TYPES,
  GET_PHOTOS,
  GET_ITEMS_STRUCTURE,
  ADD_STRUCTURES,
  DELETE_STRUCTURES
} from "../actionTypes";

const initialState = {
  structures: [],
  structureTypes: [],
  photos: [],
  items: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_STRUCTURES:
      return { ...state, structures: state.structures.concat(action.payload) };

    case GET_STRUCTURES:
      return { ...state, structures: action.payload };

    case GET_STRUCTURE_TYPES:
      return { ...state, structureTypes: action.payload };

    case GET_PHOTOS:
      return { ...state, photos: action.payload };

    case GET_ITEMS_STRUCTURE:
      return { ...state, items: action.payload };

    case DELETE_STRUCTURES:
      return {
        ...state,
        structures: state.structures.filter(
          ({ id }) => !action.payload.includes(id)
        )
      };

    default:
      return state;
  }
};
