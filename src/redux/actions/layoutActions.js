import {
    CHANGE_OPEN_MENU,
    CHANGE_SELECTED_MENU,
    SET_PROJECT_FOR_MAP
  } from "../actionTypes";

export const toggleItemMenu = (payload) => ({
    type: CHANGE_OPEN_MENU,
    payload
});

export const selectedItemMenu = (payload) => ({
  type: CHANGE_SELECTED_MENU,
  payload
});

export const setProjectForMap = (value) => {
  return (dispatch) => {
    dispatch({type: SET_PROJECT_FOR_MAP, payload: value})
  }
}

