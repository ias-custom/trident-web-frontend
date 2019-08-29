import {
    ON_LOADING,
    GET_STRUCTURES,
    GET_STRUCTURE_TYPES,
    GET_PHOTOS,
    GET_INTERACTIONS
  } from "../actionTypes";
  import StructureService from "../../services/StructureService";
  
  const service = new StructureService();
  
  export const setLoading = loading => ({ type: ON_LOADING, loading });

  export const getStructure = (projectId, structureId) => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.get(projectId, structureId);
  
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };

  export const fetchStructures = projectId => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.list(projectId);
  
        if (response.status === 200) {
          dispatch({ type: GET_STRUCTURES, payload: response.data });
        } else {
          dispatch({ type: GET_STRUCTURES, payload: [] });
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };
  
  export const addStructure = (projectId, form) => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.create(projectId, form);
  
        if (response.status === 201) {
          dispatch(fetchStructures(projectId));
        }
        return response;
      } catch (error) {
        console.error(error.log);
      } finally {
        dispatch(setLoading(false));
      }
    };
  };
  
  export const deleteStructure = (projectId, structureId) => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.delete(projectId, structureId);
  
        if (response.status === 204) {
          dispatch(fetchStructures(projectId));
        } else {
          dispatch({ type: GET_STRUCTURES, payload: [] });
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };
  
  export const updateStructure = (projectId, structureId, body) => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.update(projectId, structureId, body);
  
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };

  export const fetchStructureTypes = (projectId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.getStructureTypes(projectId);
  
        if (response.status === 200) {
          dispatch({type: GET_STRUCTURE_TYPES, payload: response.data});
        } else {
          dispatch({type: GET_STRUCTURE_TYPES, payload: []});
        }
  
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };
  
  export const addStructureType = (projectId, body) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.addStructureType(projectId, body);
        if (response.status === 201) {
          dispatch(fetchStructureTypes(projectId));
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const getPhotos = structureId => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.getPhotos(structureId);
  
        if (response.status === 200) {
          dispatch({ type: GET_PHOTOS, payload: response.data });
        } else {
          dispatch({ type: GET_PHOTOS, payload: [] });
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };

  export const addPhoto = (structureId, body) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.addPhoto(structureId, body);
        if (response.status === 201) {
          dispatch(getPhotos(structureId));
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const deletePhoto = (structureId, photoId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.deletePhoto(structureId, photoId);
        if (response.status === 204) {
          dispatch(getPhotos(structureId));
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const getInteractions = structureId => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.getInteractions(structureId);
  
        if (response.status === 200) {
          dispatch({ type: GET_INTERACTIONS, payload: response.data });
        } else {
          dispatch({ type: GET_INTERACTIONS, payload: [] });
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };

  export const deleteInteraction = (structureId, interactionId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.deleteInteraction(structureId, interactionId);
        if (response.status === 204) {
          dispatch(getInteractions(structureId));
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const addInteraction = (structureId, body) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.addInteraction(structureId, body);
        if (response.status === 201) {
          dispatch(getInteractions(structureId));
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };