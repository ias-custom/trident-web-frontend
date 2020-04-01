import {
    GET_LINES,
    DELETE_LINE,
    ON_LOADING, 
  } from '../actionTypes';
  import LineService from '../../services/LineService';
  
  const service = new LineService();
  
  export const setLoading = (loading) => ({ type: ON_LOADING, loading });
  
  export const fetchLines = () => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.list();
        if (response.status === 200) {
          dispatch({ type: GET_LINES, payload: response.data });
        } 
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };
  
  export const createLine = (body) => {
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
  
  export const getLine = (id) => {
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
  
  export const updateLine = (id, body) => {
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
  
  export const deleteLine = (id) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.delete(id);
  
        if (response.status === 204) {
          dispatch({type: DELETE_LINE, payload: id});
        } 
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const addStructureLine = (lineId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.createStructure(lineId, form);
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const getStructureLine = (lineId, structureId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.getStructure(lineId, structureId);
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const updateStructureLine = (lineId, structureId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.updateStructure(lineId, structureId, form);
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const uploadStructuresLine = (lineId, formData) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.uploadStructures(lineId, formData);
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const deleteStructureLine = (lineId, structureId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.deleteStructure(lineId, structureId);
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const deleteStructuresLine = (lineId, structureIds) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.deleteStructures(lineId, structureIds);
  
        return response;
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };