import {
    ON_LOADING,
    GET_STRUCTURES,
    GET_STRUCTURE_TYPES,
    GET_PHOTOS,
    GET_ITEMS_STRUCTURE,
    ADD_STRUCTURES
  } from "../actionTypes";
  import StructureService from "../../services/StructureService";
  
  const service = new StructureService();
  
  export const setLoading = loading => ({ type: ON_LOADING, loading });

  export const getStructure = (projectId, structureId, showLoading=true) => {
    return async dispatch => {
      if(showLoading) dispatch(setLoading(true));
  
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
  }
  export const uploadStructures = (projectId, body) => {
    return async dispatch => {
      try {
        const response = await service.upload(projectId, body);
        if (response.status === 201) {
          dispatch({type: ADD_STRUCTURES, payload: response.data})
        }
        return response;
      } catch (error) {
        return error;
      } finally {
      }
    };
  };


  // STRUCTURE TYPES
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


  // PHOTOS
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


  export const getItemsStructure = (structureId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.getItems(structureId)
        if (response.status === 200) {
          dispatch({type: GET_ITEMS_STRUCTURE, payload: response.data })
        }
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const addItemStructure = (structureId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.addItem(structureId, form)

        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const updateItemStructure = (structureId, itemId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.updateItem(structureId, itemId, form)

        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const deleteItemStructure = (structureId, itemId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.deleteItem(structureId, itemId)

        if (response.status === 204) {
          dispatch(getItemsStructure(structureId))
        }
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }