import {
    GET_PROJECTS
  } from '../actionTypes';

const initialState = {
  projects: []
};

export default (state=initialState, action) => {
  switch(action.type){
    case GET_PROJECTS:
      return {...state, 
              projects: action.payload
            };
    
    
    default:
      return state;
  }
}