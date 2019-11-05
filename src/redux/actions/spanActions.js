import {
  ON_LOADING,
  GET_SPANS,
  GET_SPAN_TYPES,
  GET_PHOTOS_SPAN,
  GET_ITEMS_SPAN,
  GET_MARKINGS,
  GET_ACCESS,
  GET_SPAN,
  SET_STRUCTURE_START,
  SET_STRUCTURE_END
} from "../actionTypes";
import SpanService from "../../services/SpanService";

const service = new SpanService();

export const setLoading = loading => ({ type: ON_LOADING, loading });

export const setSpan = spanId => ({ type: GET_SPAN, payload: spanId });

export const setStructures = (start, end) => {
  return (dispatch) => {
    dispatch({type: SET_STRUCTURE_START, payload: start})
    dispatch({type: SET_STRUCTURE_END, payload: end})
  }

}

export const getSpan = (projectId, spanId, showLoading=true) => {
  return async dispatch => {
    if(showLoading) dispatch(setLoading(true));

    try {
      const response = await service.get(projectId, spanId);
      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const addSpan = (projectId, form) => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.create(projectId, form);
  
        if (response.status === 201) {
          dispatch(fetchSpans(projectId));
        }
  
        return response;
      } catch (error) {
        console.error(error.log);
      } finally {
        dispatch(setLoading(false));
      }
    };
  };

  export const updateSpan = (projectId, spanId, body) => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.update(projectId, spanId, body);
  
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };

  export const fetchSpans = projectId => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.list(projectId);
  
        if (response.status === 200) {
          dispatch({ type: GET_SPANS, payload: response.data });
        } else {
          dispatch({ type: GET_SPANS, payload: [] });
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };
  
  export const deleteSpan = (projectId, spanId) => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.delete(projectId, spanId);
  
        if (response.status === 204) {
          dispatch(fetchSpans(projectId));
        } else {
          dispatch({ type: GET_SPANS, payload: [] });
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };
  

  //SPAN TYPES
  export const fetchSpanTypes = (projectId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.getSpanTypes(projectId);
  
        if (response.status === 200) {
          dispatch({type: GET_SPAN_TYPES, payload: response.data});
        } else {
          dispatch({type: GET_SPAN_TYPES, payload: []});
        }
  
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };
  
  export const addSpanType = (projectId, body) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.addSpanType(projectId, body);
        if (response.status === 201) {
          dispatch(fetchSpanTypes(projectId));
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };


  //PHOTOS
  export const getPhotosSpan = spanId => {
    return async dispatch => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.getPhotos(spanId);
  
        if (response.status === 200) {
          dispatch({ type: GET_PHOTOS_SPAN, payload: response.data });
        } else {
          dispatch({ type: GET_PHOTOS_SPAN, payload: [] });
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };

  export const addPhotoSpan = (spanId, body) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.addPhoto(spanId, body);
        if (response.status === 201) {
          dispatch(getPhotosSpan(spanId));
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  export const deletePhotoSpan = (spanId, photoId) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
  
      try {
        const response = await service.deletePhoto(spanId, photoId);
        if (response.status === 204) {
          dispatch(getPhotosSpan(spanId));
        }
        return response;
      } catch (error) {
        return error;
      } finally {
        dispatch(setLoading(false));
      }
    }
  };


  //ITEMS
  export const getItemsSpan = (spanId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.getItems(spanId)
        if (response.status === 200) {
          dispatch({type: GET_ITEMS_SPAN, payload: response.data })
        }
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const addItemSpan = (spanId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.addItem(spanId, form)

        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const updateItemSpan = (spanId, itemId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.updateItem(spanId, itemId, form)

        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const deleteItemSpan = (spanId, itemId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.deleteItem(spanId, itemId)

        if (response.status === 204) {
          dispatch(getItemsSpan(spanId))
        }
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const getMarkings = (spanId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.getMarkings(spanId)
        if (response.status === 200) {
          dispatch({type: GET_MARKINGS, payload: response.data })
        }
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const getMarking = (spanId, markingId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.getMarking(spanId, markingId)
        if (response.status === 200) {
          dispatch({type: GET_MARKINGS, payload: response.data })
        }
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const addMarking = (spanId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.addMarking(spanId, form)
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const updateMarking = (spanId, markingId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.updateMarking(spanId, markingId, form)
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const deleteMarking = (spanId, markingId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.deleteMarking(spanId, markingId)
        if (response.status === 204) {
          dispatch(getMarkings(spanId))
        }
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }


  //ACCESS
  export const getAccess = (spanId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.getAccess(spanId)
        if (response.status === 200) {
          dispatch({type:GET_ACCESS, payload: response.data})
        }
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const getAccessDetail = (spanId, accessId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.getAccessDetail(spanId, accessId)
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const addAccess = (spanId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.addAccess(spanId, form)
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const updateAccess = (spanId, accessId, form) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.updateAccess(spanId, accessId, form)
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  export const deleteAccess = (spanId, accessId) => {
    return async (dispatch) => {
      dispatch(setLoading(true))

      try {
        const response = await service.deleteAccess(spanId, accessId)
        if (response.status === 204) {
          dispatch(getAccess(spanId))
        }
        return response;
      } catch (error) {
        
      } finally {
        dispatch(setLoading(false));
      }
    }
  }