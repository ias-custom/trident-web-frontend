import {
    GET_SUBSTATIONS,
    DELETE_SUBSTATION,
    ON_LOADING
  } from '../actionTypes';
  import SubstationService from '../../services/SubstationService';
  
  const service = new SubstationService();
  
  export const setLoading = (loading) => ({ type: ON_LOADING, loading });
  
  export const getSubstation = (id) => {
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

  export const getSubstations = (showLoading=true) => {
    return async (dispatch) => {
      if (showLoading) dispatch(setLoading(true));
  
      try {
        const response = await service.list();
  
        if (response.status === 200) {
          dispatch({ type: GET_SUBSTATIONS, payload: response.data });
        } else {
          dispatch({ type: GET_SUBSTATIONS, payload: [] });
        }
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const deleteSubstation = (id) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.delete(id);
  
        if (response.status === 204) {
          dispatch({type: DELETE_SUBSTATION, payload: id});
        } 
        dispatch({type: DELETE_SUBSTATION, payload: id});
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const createSubstation = (body) => {
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
  
  export const updateSubstation = (id, body) => {
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

  export const getProjectsOfCustomer = (customerId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.getProjects(customerId);

        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };