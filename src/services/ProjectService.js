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

  create = async form => {
    try {
      const headers = { 'content-type': 'multipart/form-data' };

      return await this.http.post('/projects/', form, { headers });
    } catch (error) {
      return error.response;
    }
  };

  update = async (id, form) => {
    try {
      const headers = { 'content-type': 'multipart/form-data' };
      const url = `/projects/${id}/`;

      return await this.http.patch(url, form, { headers });
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


  //SPAMS
  listSpams = async (projectId) => {
    try {
      return await this.http.get(`/projects/${projectId}/spans/`);
    } catch (error) {
      return error.response;
    }
  };

  deleteSpam = async (projectId, spamId) => {
    try {
      return await this.http.delete(`/projects/${projectId}/spans/${spamId}`);
    } catch (error) {
      return error.response;
    }
  };
}

export default ProjectService;
