import RoleService from '../../services/RoleService';
import {
  ENQUEUE_SNACKBAR,
  GET_ROLES,
  ON_LOADING,
  REMOVE_SNACKBAR,
  HANDLE_FORM,
  SET_CURRENT_FORM,
  SHOW_ALERT
} from "../actionTypes";

const roleService = new RoleService();

export const setLoading = (loading) => ({ type: ON_LOADING, loading });

export const addSnackbar = notification => ({
  type: ENQUEUE_SNACKBAR,
  notification: {
    key: new Date().getTime() + Math.random(),
    ...notification,
  },
});

export const removeSnackbar = key => ({
  type: REMOVE_SNACKBAR,
  key,
});


export const fetchRoles = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await roleService.list();

      if (response.status === 200) {
        dispatch({type: GET_ROLES, payload: response.data});
      } else {
        dispatch({type: GET_ROLES, payload: []});
      }
      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export const setHandleForm = (handleForm) => ({
  type: HANDLE_FORM,
  handleForm,
})

export const setCurrentForm = (currentForm) => ({
  type: SET_CURRENT_FORM,
  currentForm,
})

export const deleteRole = (id) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await roleService.delete(id);

      if (response.status === 204) {
        dispatch(fetchRoles());
      } else {
        const alert = {type: 'error', message: 'The request could not be processed!'};
        dispatch({ type: SHOW_ALERT, alert});
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
}

export const createRole = (body) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await roleService.create(body);

      if (response.status === 201) {
        dispatch(fetchRoles());
      } else {
        const alert = {type: 'error', message: 'The request could not be processed!'};
        dispatch({ type: SHOW_ALERT, alert});
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
}

export const getRole = (id) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await roleService.get(id);

      if (response.status === 200) {
       dispatch(fetchRoles());
      } else {
        const alert = {type: 'error', message: 'The request could not be processed!'};
        dispatch({ type: SHOW_ALERT, alert});
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export const updateRole = (id, body) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await roleService.update(id, body);

      if (response.status === 200) {
        dispatch(fetchRoles());
      } else {
        const alert = {type: 'error', message: 'The request could not be processed!'};
        dispatch({ type: SHOW_ALERT, alert});
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
};

