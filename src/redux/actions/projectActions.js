import {
  ON_LOADING,
  GET_PROJECTS,
  GET_STRUCTURES,
  GET_SPANS,
  GET_TAGS,
  GET_USERS_PROJECT,
  GET_PROJECT,
  GET_STRUCTURE_TYPES,
  GET_SPAN_TYPES
} from "../actionTypes";
import ProjectService from "../../services/ProjectService";

const service = new ProjectService();

export const setLoading = loading => ({ type: ON_LOADING, loading });

export const createProject = body => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.create(body);

      if (response.status === 204) {
        dispatch(fetchProjects());
      }

      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getProject = id => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.get(id);

      if (response.status === 200) {
        dispatch({ type: GET_PROJECT, payload: response.data });
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const fetchProjects = () => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.list();

      if (response.status === 200) {
        dispatch({ type: GET_PROJECTS, payload: response.data });
      } else {
        dispatch({ type: GET_PROJECTS, payload: [] });
      }
      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteProject = id => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.delete(id);

      if (response.status === 204) {
        dispatch(fetchProjects());
      }

      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateProject = (id, body) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.update(id, body);

      if (response.status === 200) {
        dispatch(fetchProjects());
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// STRUCTURES
export const fetchStructures = projectId => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.listStructures(projectId);

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
      const response = await service.addStructure(projectId, form);

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
      const response = await service.deleteStructure(projectId, structureId);

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

export const fetchStuctureTypes = (projectId) => {
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
        dispatch(fetchStuctureTypes(projectId));
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
export const addSpan = (projectId, form) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.addSpan(projectId, form);

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
      const response = await service.listSpans(projectId);

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
      const response = await service.deleteSpan(projectId, spanId);

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

// TAGS
export const fetchTags = () => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.listTags();

      if (response.status === 200) {
        dispatch({ type: GET_TAGS, payload: response.data });
      } else {
        dispatch({ type: GET_TAGS, payload: [] });
      }
      return response;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// USERS OF PROJECT
export const getUsersProject = projectId => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.getUsers(projectId);

      if (response.status === 200) {
        const users = response.data.map(({ user, id }) => {
          return { ...user, relation_id: id };
        });
        dispatch({ type: GET_USERS_PROJECT, payload: users });
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const addUser = (projectId, form) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.addUser(projectId, form);

      if (response.status === 201) {
        dispatch(getUsersProject(projectId));
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteUser = (projectId, userId) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.deleteUser(projectId, userId);

      if (response.status === 204) {
        dispatch(getUsersProject(projectId));
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};
