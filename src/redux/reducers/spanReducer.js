import { GET_SPANS, GET_SPAN_TYPES, GET_PHOTOS_SPAN } from "../actionTypes";

const initialState = {
  spans: [],
  spanTypes: [],
  photos: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SPANS:
      return { ...state, spans: action.payload };

    case GET_SPAN_TYPES:
      return {...state, spanTypes: action.payload};

    case GET_PHOTOS_SPAN:
      return {...state, photos: action.payload};
    
      default:
      return state;
  }
};
