import { GET_LINES, DELETE_LINE } from '../actionTypes';

const initialState = {
  list: []
};

export default (state=initialState, action) => {
  switch(action.type){
    case GET_LINES:
      return {
        ...state,
        list: action.payload
      };
    case DELETE_LINE: 
      return {
        ...state,
        list: state.list.filter(line => line.id !== action.payload)
      };
    default:
      return state;
  }
}