import Service from './Service';
import store from '../redux/store';

class ProjectService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }

  list = async () => {
    try {
      return await this.http.get(`/customers/${this.getCustomerSelectedId()}/projects/`);
    } catch (error) {
      return error.response;
    }
  };

  create = async body => {
    try {

      return await this.http.post(`/customers/${this.getCustomerSelectedId()}/projects/`, body );
    } catch (error) {
      return error.response;
    }
  };

  update = async (id, body) => {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/projects/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  };

  get = async id => {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/projects/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };

  getInfo = async id => {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/projects/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };

  delete = async id => {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/projects/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  };
  

  //TAGS
  listTags = async () => {
    try {
      return await this.http.get(`/tags/`);
    } catch (error) {
      return error.response;
    }
  };

  
  // USERS OF PROJECT
  getUsers = async projectId => {
    try {
      const url = `/projects/${projectId}/users/`;

      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };

  addUser = async (projectId, form) => {
    try {
      const url = `/projects/${projectId}/users/`;

      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  };

  deleteUser = async (projectId, userId) => {
    try {
      const url = `/projects/${projectId}/users/${userId}`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  };


  // INSPECTIONS
  getInspections = async projectId => {
    try {
      const url = `/projects/${projectId}/inspections/`;
  
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };

  getCategories = async inspectionId => {
    try {
      const url = `/inspections/${inspectionId}/categories/`;
  
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };

  updateCategory = async (categoryId, inspectionId, form) => {
    try {
      const url = `/inspections/${inspectionId}/categories/${categoryId}/`;
  
      return await this.http.patch(url, form);
    } catch (error) {
      return error.response;
    }
  };

  updateItemCategory = async (categoryId, itemId, form) => {
    try {
      const url = `/categories/${categoryId}/parent-items/${itemId}/`;
  
      return await this.http.patch(url, form);
    } catch (error) {
      return error.response;
    }
  };

  getDeficiencies = async projectId => {
    try {
      const url = `/projects/${projectId}/deficiencies/`;
  
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };

  addDeficiency = async (projectId, form) => {
    try {
      const url = `/projects/${projectId}/deficiencies/`;

      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  };
  
  deleteDeficiency = async (projectId, deficiencyId) => {
    try {
      const url = `/projects/${projectId}/deficiencies/${deficiencyId}`;

      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  };

  getCategoriesMarking = async () => {
    try {
      return await this.http.get(`/marking-categories`);
    } catch (error) {
      return error.response;
    }
  };

  getCategoriesAccess = async () => {
    try {
      return await this.http.get(`/access-categories`);
    } catch (error) {
      return error.response;
    }
  };

  getMarkingsTypes = async projectId => {
    try {
      return await this.http.get(`/marking-types`);
    } catch (error) {
      return error.response;
    }
  };
  
  getAccessTypes = async projectId => {
    try {
      return await this.http.get(`/access-types`);
    } catch (error) {
      return error.response;
    }
  };

  getAccessTypeDetail = async accessTypeId => {
    try {
      const url = `/access-types/${accessTypeId}/details`
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };

  //SETS
  addSet = async (projectId, form) => {
    try {
      const url = `/projects/${projectId}/sets/`;

      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  };

  fetchInspectionsProject = async () => {
    try {
      const url = `/project-inspections`;

      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };
}


export default ProjectService;
