import Service from './Service';
import store from '../redux/store';

class SpanService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }

  create = async (projectId, form) => {
    try {
      const url = `projects/${projectId}/spans/`;

      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  };

  list = async (projectId) => {
    try {
      return await this.http.get(`/projects/${projectId}/spans/`);
    } catch (error) {
      return error.response;
    }
  };

  delete = async (projectId, spanId) => {
    try {
      return await this.http.delete(`/projects/${projectId}/spans/${spanId}`);
    } catch (error) {
      return error.response;
    }
  };

  getSpanTypes = async (projectId) => {
    try {
        return await this.http.get(`/projects/${projectId}/span-types/`);
    } catch (error) {
        return error.response;
    }
  }

  addSpanType = async (projectId, body) => {
    try {
        return await this.http.post(`/projects/${projectId}/span-types/`, body);
    } catch (error) {
        return error.response;
    }
  }

}

export default SpanService;
