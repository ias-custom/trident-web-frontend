import Service from "./Service";
import store from "../redux/store";

class UserService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }

  async list() {
    try {
      return await this.http.get(`/customers/${this.getCustomerSelectedId()}/users/`);
    } catch (error) {
      return error.response;
    }
  }

  async get(id) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/users/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  }

  async create(body = {}) {
    try {
      return await this.http.post(`/customers/${this.getCustomerSelectedId()}/users/`, body);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async update(id, body = {}) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/users/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  }

  async delete(id) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/users/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  }
}

export default UserService;