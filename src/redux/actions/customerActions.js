import CustomerService from '../../services/CustomerService';
import {
  GET_CUSTOMERS,
  ON_LOADING,
  HANDLE_FORM,
  SET_CURRENT_FORM,
  SHOW_ALERT
} from "../actionTypes";

const customerService = new CustomerService();

export const setLoading = (loading) => ({ type: ON_LOADING, loading });

export const getCustomers = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await customerService.list();
      if (response.status === 200) {
        dispatch({type: GET_CUSTOMERS, payload: response.data});
      } else {
        dispatch({type: GET_CUSTOMERS, payload: []});
      }
      return response;

    } catch (error) {
      return error;

    } finally {
      dispatch(setLoading(false));
    }
  }
}

export const deleteCustomer = (id) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await customerService.delete(id);

      if (response.status === 204) {
        dispatch(getCustomers());
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

export const createCustomer = (body) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await customerService.create(body);
      if (response.status === 200) {
        dispatch(getCustomers());
      } 
      return response;

    } catch (error) {
      return error;

    } finally {
      dispatch(setLoading(false));
    }
  }
}

export const getCustomer = (id) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await customerService.get(id);

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export const updateCustomer = (id, body) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await customerService.update(id, body);

      if (response.status === 200) {
        dispatch(getCustomers());
      } 

      return response;
    } catch (error) {
      console.error(error);
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