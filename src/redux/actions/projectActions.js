
import {
    ON_LOADING,
    GET_PROJECTS,
    GET_STRUCTURES,
    GET_SPAMS
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
        
        if (response.status === 204) {
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


  // STRUCTURES
  export const fetchStructures = (projectId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.listStructures(projectId);
  
        if (response.status === 200) {
          dispatch({type: GET_STRUCTURES, payload: response.data});
        } else {
          dispatch({type: GET_STRUCTURES, payload: []});
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const deleteStructure = (projectId, structureId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.deleteStructure(projectId, structureId);
  
        if (response.status === 204) {
          dispatch(fetchStructures(projectId));
        } else {
          dispatch({type: GET_SPAMS, payload: []});
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };
  
  // SPAMS
  export const fetchSpams = (projectId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.listSpams(projectId);
  
        if (response.status === 200) {
          dispatch({type: GET_SPAMS, payload: response.data});
        } else {
          dispatch({type: GET_SPAMS, payload: []});
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const deleteSpam = (projectId, spamId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.deleteSpam(projectId, spamId);
  
        if (response.status === 204) {
          dispatch(fetchSpams(projectId));
        } else {
          dispatch({type: GET_SPAMS, payload: []});
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };