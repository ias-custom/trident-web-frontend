import {
    GET_SETS, DELETE_SET, DUPLICATE_SET
  } from '../actionTypes';
  
  const initialState = {
    list: [
      {
        id: 1,
        name: "Name set 1"
      },
      {
        id: 2,
        name: "Name set 2"
      },
      {
        id: 3,
        name: "Name set 3"
      }
    ]
  };
  
  export default (state = initialState, action) => {
  
    switch (action.type) {
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