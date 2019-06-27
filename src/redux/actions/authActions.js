import {
  LOGIN,
  LOGIN_ERROR,
  LOGOUT,
  ON_LOADING,
  REFRESH_TOKEN
} from '../actionTypes';
import AuthService from '../../services/AuthService';

const service = new AuthService();

export const refreshToken = () => {
  return async (dispatch, getState) => {
    try {
      const auth = getState().auth;
      const response = await service.refreshToken(auth.token);

      if (response.status === 200) {
        const data = { ...auth, token: response.data.token };

        localStorage.setItem('auth', JSON.stringify(data));
        dispatch({ type: REFRESH_TOKEN, payload: data });

        console.log('Refresh token');
      } else {
        dispatch(logout());
        console.log('Error refresh token', response.data);
      }

      return response;
    } catch (error) {
      console.error(error);
    }
  }
};

export const login = (username, password) => {
  return async (dispatch) => {
    dispatch({ type: ON_LOADING, loading: true});

    try {
      const response = await service.login(username, password);

      if (response.status === 200) {
        const { id, first_name = '', last_name = '', username, token } = response.data;
        const fullName = first_name ? `${first_name} ${last_name}` : username;
        const avatar = fullName.replace(/\s/g, '').substr(0, 2).toUpperCase();
        const auth = { id, fullName, username, avatar, token };

        localStorage.setItem('auth', JSON.stringify(auth));

        dispatch({ type: LOGIN, payload: auth});
      } else {
        dispatch({ type: LOGIN_ERROR})
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: ON_LOADING, loading: false});
    }
  }
};

export const logout = () => {
  localStorage.removeItem('auth');

  return { type: LOGOUT };
};

export const forgotPassword = (email) => {
  return async dispatch => {
    try {
      return await service.forgotPassword(email);
    } catch (error) {
      console.error(error);
    }
  }
};

export const resetPassword = (form) => {
  return async dispatch => {
    try {
      return await service.resetPassword(form);
    } catch (error) {
      console.error(error);
    }
  }
};