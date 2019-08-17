import {
    CHANGE_OPEN_MENU,
    CHANGE_SELECTED_MENU
  } from "../actionTypes";

export const toggleItemMenu = (payload) => ({
    type: CHANGE_OPEN_MENU,
    payload
});

export const selectedItemMenu = (payload) => ({
  type: CHANGE_SELECTED_MENU,
  payload
});

