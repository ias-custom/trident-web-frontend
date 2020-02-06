import { GET_LINES, DELETE_LINE } from '../actionTypes';

const initialState = {
  list: [
    {
      id: 1,
      name: 'line 1',
      accounting_code: 'SDFSDF',
      start_substation: 'Hdsadsad',
      end_substation: 'Fdsfird'
    },
    {
      id: 2,
      name: 'line 2',
      accounting_code: 'SDCKD',
      start_substation: 'Hdsadsad',
      end_substation: 'Fdsfird'
    },
    {
      id: 3,
      name: 'line 3',
      accounting_code: 'JGMVOR',
      start_substation: 'Hdsadsad',
      end_substation: 'Fdsfird'
    }
    
  ]
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