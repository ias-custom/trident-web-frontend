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
      const url = `customers/${this.getCustomerSelectedId()}/projects/${id}/`;
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


  // STRUCTURES
  listStructures = async (projectId) => {
    try {
      return await this.http.get(`/projects/${projectId}/structures/`);
    } catch (error) {
      return error.response;
    }
  };

  deleteStructure = async (projectId, structureId) => {
    try {
      return await this.http.delete(`/projects/${projectId}/structures/${structureId}`);
    } catch (error) {
      return error.response;
    }
  };

  addStructure = async (projectId, form) => {
    try {
      const url = `projects/${projectId}/structures/`;
      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  };


  //SPAMS
  listSpans = async (projectId) => {
    try {
      return await this.http.get(`/projects/${projectId}/spans/`);
    } catch (error) {
      return error.response;
    }
  };

  deleteSpan = async (projectId, spanId) => {
    try {
      return await this.http.delete(`/projects/${projectId}/spans/${spanId}`);
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
      const url = `projects/${projectId}/users/`;

      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };

  addUser = async (projectId, form) => {
    try {
      const url = `projects/${projectId}/users/`;

      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  };

  deleteUser = async (projectId, userId) => {
    try {
      const url = `projects/${projectId}/users/${userId}`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  };
}

export default ProjectService;
