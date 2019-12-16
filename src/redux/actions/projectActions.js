import {
  ON_LOADING,
  GET_PROJECTS,
  GET_TAGS,
  GET_USERS_PROJECT,
  GET_PROJECT,
  GET_CATEGORIES_PROJECT,
  GET_CATEGORIES_INSPECTION,
  GET_MARKINGS_TYPES,
  GET_ACCESS_TYPES,
  GET_ACCESS_TYPE_DETAILS,
  GET_STRUCTURES,
  GET_SPANS,
  GET_MARKINGS,
  GET_ACCESS,
  SET_LATITUDE,
  SET_LONGITUDE,
  GET_INTERACTIONS,
  SET_FROM_MAP,
  SET_PROJECT_FOR_MAP,
  GET_CATEGORIES_MARKING,
  GET_CATEGORIES_ACCESS,
  ADD_USER_PROJECT,
  DELETE_USER_PROJECT,
  INSPECTIONS_PROJECT
} from "../actionTypes";
import ProjectService from "../../services/ProjectService";

const service = new ProjectService();

export const setLoading = loading => ({ type: ON_LOADING, loading });

export const setPoint = (latitude, longitude) => {
  return (dispatch) => {
    dispatch({type: SET_LATITUDE, payload: latitude})
    dispatch({type: SET_LONGITUDE, payload: longitude})
  }
}

export const setFromMap = (value) => {
  return (dispatch) => {
    dispatch({type: SET_FROM_MAP, payload: value})
  }
}

export const setProjectForMap = (value) => {
  return (dispatch) => {
    dispatch({type: SET_PROJECT_FOR_MAP, payload: value})
  }
}

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

export const getInfoProject = id => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.getInfo(id);

      if (response.status === 200) {
        const { structures, spans, markings, access } = response.data
        dispatch({ type: GET_STRUCTURES, payload: structures });
        dispatch({ type: GET_SPANS, payload: spans });
        dispatch({ type: GET_MARKINGS, payload: markings });
        dispatch({ type: GET_ACCESS, payload: access });
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getProject = (id, saveData = true) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.get(id);
      if (response.status === 200) {
        if (saveData) {
          const { structures, spans, users, interactions, crossings, access } = response.data
          dispatch({ type: GET_PROJECT, payload: response.data });
          dispatch({ type: GET_USERS_PROJECT, payload: users });
          dispatch({ type: GET_STRUCTURES, payload: structures });
          dispatch({ type: GET_SPANS, payload: spans });
          dispatch({ type: GET_MARKINGS, payload: crossings });
          dispatch({ type: GET_ACCESS, payload: access });
          dispatch({ type: GET_INTERACTIONS, payload: interactions });
        }
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

export const fetchInspectionsProject = () => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.fetchInspectionsProject();
      if (response.status === 200) {
        dispatch({type: INSPECTIONS_PROJECT, payload: response.data});
      }

      return response;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
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
        dispatch({ type: GET_USERS_PROJECT, payload: response.data });
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
        dispatch({type: ADD_USER_PROJECT, payload: response.data.user_id});
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
        dispatch({type: DELETE_USER_PROJECT, payload: userId});
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};


export const getCategoriesInspection = inspectionId => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      const response = await service.getCategories(inspectionId);

      if (response.status === 200) {
        dispatch({ type: GET_CATEGORIES_INSPECTION, payload: response.data });
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export const getCategoriesProject = inspectionId => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      const response = await service.getCategories(inspectionId);

      if (response.status === 200) {
        dispatch({ type: GET_CATEGORIES_PROJECT, payload: response.data });
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export const getCategoriesAccess = () => {
  return async(dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await service.getCategoriesAccess();
      if (response.status === 200) {
        dispatch({type: GET_CATEGORIES_ACCESS, payload: response.data})
      }
      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  }
}

export const getCategoriesMarking = () => {
  return async(dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await service.getCategoriesMarking();
      if (response.status === 200) {
        dispatch({type: GET_CATEGORIES_MARKING, payload: response.data})
      }
      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  }
}

export const getMarkingsTypes = (projectId) => {
  return async(dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await service.getMarkingsTypes(projectId);
      if (response.status === 200) {
        dispatch({type: GET_MARKINGS_TYPES, payload: response.data})
      }
      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  }
}

export const getAccessTypes = (projectId) => {
  return async(dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await service.getAccessTypes(projectId);
      if (response.status === 200) {
        dispatch({type: GET_ACCESS_TYPES, payload: response.data})
      }
      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  }
}

export const getAccessTypeDetail = (accessTypeId) => {
  return async(dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await service.getAccessTypeDetail(accessTypeId);
      if (response.status === 200) {
        dispatch({type: GET_ACCESS_TYPE_DETAILS, payload: response.data})
      }
      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  }
}

// SETS
export const addSet = (projectId, form) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.addSet(projectId, form);

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};