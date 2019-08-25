
import {
    ON_LOADING,
    GET_PROJECTS
  } from '../actionTypes';
  import ProjectService from '../../services/ProjectService';
  
  const service = new ProjectService();
  
  export const setLoading = (loading) => ({ type: ON_LOADING, loading });

  export const fetchProjects = () => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.list();
  
        if (response.status === 200) {
          dispatch({type: GET_PROJECTS, payload: response.data});
        } else {
          dispatch({type: GET_PROJECTS, payload: []});
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const deleteProject = () => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.delete();
  
        if (response.status === 200) {
          dispatch(fetchProjects());
        } 
        
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };