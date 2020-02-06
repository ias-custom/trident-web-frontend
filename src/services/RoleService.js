import Service from "./Service";
import store from "../redux/store";

class RoleService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }
  
  async list() {
      try {
          return await this.http.get(`/customers/${this.getCustomerSelectedId()}/roles/`);
      } catch (error) {
          return error.response;
      }
  }
  async get(id) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/roles/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  }

  async create(body = {}) {
    try {
      return await this.http.post(`/customers/${this.getCustomerSelectedId()}/roles/`, body);
    } catch (error) {
      return error.response;
    }
  }

  async update(id, body = {}) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/roles/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  }

  async delete(id) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/roles/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  }
}

export default RoleService;
