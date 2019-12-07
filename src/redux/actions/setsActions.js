import {
    GET_SETS,
    DELETE_SET,
    ON_LOADING,
    DUPLICATE_SET,
    GET_DEFAULT_SET
  } from '../actionTypes';
  import SetService from '../../services/SetService';
  
  const service = new SetService();
  
  export const setLoading = (loading) => ({ type: ON_LOADING, loading });
  
  export const getDefaultSet = (type) => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.getDefault(1, type);
        if (response.status === 200) {
          let { inspections } = response.data
          dispatch({type: GET_DEFAULT_SET, payload: inspections})
        }
        return response;
      } catch (error) {
        console.error(error.log);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const getSet = (id) => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.get(id);
  
        return response;
      } catch (error) {
        console.error(error.log);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const fetchSets = () => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.list();
  
        if (response.status === 200) {
          dispatch({ type: GET_SETS, payload: response.data });
        } else {
          dispatch({ type: GET_SETS, payload: [] });
        }
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const deleteSet = (id) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.delete(id);
  
        if (response.status === 204) {
          dispatch({type: DELETE_SET, payload: id});
        } 
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const createSet = (body) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.create(body);
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };
  
  export const updateSet = (id, body) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.update(id, body);
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const duplicateSet = (form) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.duplicate(form);
  
        if (response.status === 201) {
          dispatch({type: DUPLICATE_SET, payload: response.data});
        }
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };