import {
  ON_LOADING,
  GET_PROJECTS,
  GET_TAGS,
  GET_USERS_PROJECT,
  GET_INSPECTIONS_PROJECT,
  GET_PROJECT,
  GET_CATEGORIES_PROJECT,
  SET_CATEGORIES_EMPTY,
  GET_CATEGORIES_INSPECTION,
  GET_DEFICIENCIES
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

// INSPECTIONS
export const getInspectionsProject = projectId => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.getInspections(projectId);

      if (response.status === 200) {
        dispatch({ type: GET_INSPECTIONS_PROJECT, payload: response.data });

        dispatch({ type: SET_CATEGORIES_EMPTY, payload: [] });
        response.data.forEach(({ id }) => {
          dispatch(getCategoriesProject(id));
        });
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateCategoryInspection = (categoryId, inspectionId, form) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.updateCategory(categoryId, inspectionId, form);

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateItemCategory = (categoryId, itemId, form) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.updateItemCategory(categoryId, itemId, form);

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getDeficiencies = (projectId) => {
  return async(dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await service.getDeficiencies(projectId);
      if (response.status === 200) {
        dispatch({type: GET_DEFICIENCIES, payload: response.data})
      }
      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  }
}

export const addDeficiency = (projectId, form) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.addDeficiency(projectId, form);

      if (response.status === 201) {
        dispatch(getDeficiencies(projectId));
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const deleteDeficiency = (projectId, deficiencyId) => {
  return async dispatch => {
    dispatch(setLoading(true));

    try {
      const response = await service.deleteDeficiency(projectId, deficiencyId);

      if (response.status === 204) {
        dispatch(getDeficiencies(projectId));
      }

      return response;
    } catch (error) {
      console.error(error.log);
    } finally {
      dispatch(setLoading(false));
    }
  };
};