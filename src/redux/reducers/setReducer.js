import {
    GET_SETS, DELETE_SET, DUPLICATE_SET, GET_DEFAULT_SET
  } from '../actionTypes';
  
  const initialState = {
    list: [],
    inspections: [],
    deficiencies: []
  };
  
  export default (state = initialState, action) => {
  
    switch (action.type) {
      case GET_DEFAULT_SET:
        return {
          ...state,
          inspections: action.payload.inspections,
          deficiencies: action.payload.deficiencies
        };

      case GET_SETS:
        return {
          ...state,
          list: action.payload,
          errors: []
        };

      case DELETE_SET:
        const list = state.list.filter(({id}) => id !== action.payload)
        return {
          ...state,
          list: list,
          errors: []
        };

      case DUPLICATE_SET:
        const newList = state.list.concat(action.payload)
        return {
          ...state,
          list: newList,
          errors: []
        };
  
      default:
        return state;
    }
  };