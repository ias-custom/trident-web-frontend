import Service from "./Service";
import store from "../redux/store";

class SetService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }
  
  async getDefault(type) {
    try {
      const url = `/default-sets`;
      return await this.http.get(url, {
        params: {
          inspection_id: type
        }
      });
    } catch (error) {
      return error.response;
    }
  }
  async list() {
    try {
      return await this.http.get(`/customers/${this.getCustomerSelectedId()}/sets`);
    } catch (error) {
      return error.response;
    }
  }


  async get(id) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/sets/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  }

  async create(body = {}) {
    try {
      return await this.http.post(`/customers/${this.getCustomerSelectedId()}/sets/`, body);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async update(id, body = {}) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/sets/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  }

  async delete(id) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/sets/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  }

  async duplicate(form) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/duplicate-sets/`;
      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  }
}

export default SetService;