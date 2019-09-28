import Service from "./Service";
import store from "../redux/store";

class SetService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }

  async list() {
    try {
      return await this.http.get(`/sets`);
    } catch (error) {
      return error.response;
    }
  }

  async get(id) {
    try {
      const url = `/sets/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  }

  async create(body = {}) {
    try {
      return await this.http.post(`/sets/`, body);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async update(id, body = {}) {
    try {
      const url = `/sets/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  }

  async delete(id) {
    try {
      const url = `/sets/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  }

  async duplicate(form) {
    try {
      const url = `/sets/duplicate/`;
      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  }
}

export default SetService;