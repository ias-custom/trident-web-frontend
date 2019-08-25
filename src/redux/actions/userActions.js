import {
  CREATE_USER,
  CREATE_USER_ERROR,
  GET_USER,
  GET_USERS,
  GET_USERS_ERROR,
  ON_LOADING, SHOW_ALERT, UPDATE_USER, UPDATE_USER_ERROR
} from '../actionTypes';
import UserService from '../../services/UserService';

const service = new UserService();

export const setLoading = (loading) => ({ type: ON_LOADING, loading });

export const getUsers = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await service.list();

      if (response.status === 200) {
        dispatch({ type: GET_USERS, payload: response.data });
      } else {
        dispatch({ type: GET_USERS_ERROR, payload: response.data });
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export const createUser = (body) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await service.create(body);

      if (response.status === 201) {
        dispatch({ type: CREATE_USER, payload: response.data });
      } else {
        dispatch({ type: CREATE_USER_ERROR, payload: response.data });
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export const getUser = (id) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.get(id);

      if (response.status === 200) {
        console.log(response.data)
       dispatch({ type: GET_USER, payload: response.data });
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export const updateUser = (id, body) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await service.update(id, body);

      if (response.status === 200) {
        dispatch({ type: UPDATE_USER, payload: response.data });
      } else {
        dispatch({ type: UPDATE_USER_ERROR, payload: response.data });
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export const deleteUser = (id) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await service.delete(id);

      if (response.status === 204) {
        dispatch(getUsers());
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