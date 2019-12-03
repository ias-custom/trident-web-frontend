import {
    CHANGE_OPEN_MENU,
    CHANGE_SELECTED_MENU
  } from '../actionTypes';

const initialState = {
  itemsMenu: {
    admin: {
      open: false,
      users: false,
      roles: false,
      customers: false
    },
    projects: {
      list: false
    },
    setup: {
      open: false,
      substations: false,
      sets: false
    }
  }
};

export default (state=initialState, action) => {
  switch(action.type){
    case CHANGE_OPEN_MENU:
      return {...state, 
              itemsMenu: {
                ...state.itemsMenu,
                [action.payload.nameItem]: {
                  ...state.itemsMenu[action.payload.nameItem],
                  open: action.payload.open
                }
              }
            };
    
    case CHANGE_SELECTED_MENU:
      let newMenu = {...state.itemsMenu}
      try {
        const keys = Object.keys(newMenu)
        for (const key of keys) {
          let keysItem = Object.keys(newMenu[key])
          for (const keyItem of keysItem) {
            if(keyItem !== 'open'){
              if(key === action.payload.nameItem){
                newMenu[key][keyItem] = keyItem === action.payload.nameSubItem
              }
              else{
                newMenu[key][keyItem] = false
              }
            } 
          } 
          if (key !== action.payload.nameItem) {
            newMenu[key]['open'] = false
          }
        }
      } catch (error) {
        console.log(error)
      }
      return {
        ...state,
        itemsMenu: newMenu
      };

    default:
      return state;
  }
}