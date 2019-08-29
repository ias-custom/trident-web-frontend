import { GET_SPANS, GET_SPAN_TYPES } from "../actionTypes";

const initialState = {
  spans: [],
  spanTypes: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SPANS:
      return { ...state, spans: action.payload };

    case GET_SPAN_TYPES:
      return {...state, spanTypes: action.payload};
    
      default:
      return state;
  }
};
