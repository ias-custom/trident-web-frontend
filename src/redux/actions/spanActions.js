import {
    ON_LOADING,
    GET_SPANS,
    GET_SPAN_TYPES
  } from "../actionTypes";
  import SpanService from "../../services/SpanService";
  
  const service = new SpanService();
  
  export const setLoading = loading => ({ type: ON_LOADING, loading });

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
  