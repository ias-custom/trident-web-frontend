import {
  GET_SPANS,
  GET_SPAN_TYPES,
  GET_PHOTOS_SPAN,
  GET_ITEMS_SPAN,
  GET_MARKINGS,
  GET_ACCESS,
  GET_SPAN
} from "../actionTypes";

const initialState = {
  spans: [],
  spanId: "",
  spanTypes: [],
  photos: [],
  items: [],
  markings: [],
  access: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SPANS:
      return { ...state, spans: action.payload };

    case GET_SPAN:
      return { ...state, spanId: action.payload };

    case GET_SPAN_TYPES:
      return { ...state, spanTypes: action.payload };

    case GET_PHOTOS_SPAN:
      return { ...state, photos: action.payload };

    case GET_ITEMS_SPAN:
      return { ...state, items: action.payload };

    case GET_MARKINGS:
      return { ...state, markings: action.payload };

    case GET_ACCESS:
      return { ...state, access: action.payload };

    default:
      return state;
  }
};
