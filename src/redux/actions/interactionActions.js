import {
  ON_LOADING,
  GET_INTERACTIONS,
  DELETE_INTERACTION
} from "../actionTypes";
import InteractionService from "../../services/InteractionService";

const service = new InteractionService();

export const setLoading = loading => ({ type: ON_LOADING, loading });

export const fetchInteractions = (projectId) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.list(projectId);
      if (response.status === 200) {
        dispatch({ type: GET_INTERACTIONS, payload: response.data });
      }
      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};


export const getInteraction = (projectId, interactionId) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.get(projectId, interactionId);

      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};


export const deleteInteraction = (projectId, interactionId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await service.delete(projectId, interactionId);
      if (response.status === 204){
        dispatch({type: DELETE_INTERACTION, payload: interactionId})
      }
      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  }
};


export const updateInteraction = (projectId, interactionId, form) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await service.update(projectId, interactionId, form);
      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  }
};


export const addInteraction = (projectId, body) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await service.create(projectId, body);
      
      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  }
};
