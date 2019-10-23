import {
  ENQUEUE_SNACKBAR,
  GET_STATES,
  ON_LOADING,
  REMOVE_SNACKBAR,
  HANDLE_FORM,
  SET_CURRENT_FORM,
  GET_ITEM_STATES
} from "../actionTypes";
import GlobalService from "../../services/GlobalService";

const globalService = new GlobalService();

export const setLoading = loading => ({ type: ON_LOADING, loading });

export const addSnackbar = notification => ({
  type: ENQUEUE_SNACKBAR,
  notification: {
    key: new Date().getTime() + Math.random(),
    ...notification
  }
});

export const removeSnackbar = key => ({
  type: REMOVE_SNACKBAR,
  key
});

export const fetchItemStates = () => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await globalService.getItemStates();

      if (response.status === 200) {
        dispatch({
          type: GET_ITEM_STATES,
          payload: response.data.filter(({ id }) => id !== 4) // ID OF STATE DEFICIENT
        });
      } else {
        dispatch({ type: GET_ITEM_STATES, payload: [] });
      }

      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const addDeficiencyItem = (itemId, form) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await globalService.addDeficiencyItem(itemId, form);

      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteDeficiencyItem = (itemId, deficiencyItem) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await globalService.deleteDeficiencyItem(
        itemId,
        deficiencyItem
      );

      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateDeficiencyItem = (itemId, deficiencyItem, form) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await globalService.updateDeficiencyItem(
        itemId,
        deficiencyItem,
        form
      );

      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const fetchStates = () => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await globalService.getStates();

      if (response.status === 200) {
        dispatch({ type: GET_STATES, payload: response.data });
      } else {
        dispatch({ type: GET_STATES, payload: [] });
      }

      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const setHandleForm = handleForm => ({
  type: HANDLE_FORM,
  handleForm
});

export const setCurrentForm = currentForm => ({
  type: SET_CURRENT_FORM,
  currentForm
});
