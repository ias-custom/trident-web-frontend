import Service from "./Service";
import store from "../redux/store";

class LineService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }
  
  async list() {
    try {
      return await this.http.get(`/customers/${this.getCustomerSelectedId()}/lines/`);
    } catch (error) {
      return error.response;
    }
  }

  async get(id) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/lines/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  }

  async create(body = {}) {
    try {
      return await this.http.post(`/customers/${this.getCustomerSelectedId()}/lines/`, body);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async update(id, body = {}) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/lines/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  }

  async delete(id) {
    try {
      const url = `/customers/${this.getCustomerSelectedId()}/lines/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  }

  async createStructure(lineId, body = {}) {
    try {
      return await this.http.post(`/lines/${lineId}/structures/`, body);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async getStructure(lineId, structureId) {
    try {
      return await this.http.get(`/lines/${lineId}/structures/${structureId}`);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async updateStructure(lineId, structureId, form) {
    try {
      return await this.http.patch(`/lines/${lineId}/structures/${structureId}/`, form);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async deleteStructure(lineId, structureId) {
    try {
      return await this.http.delete(`/lines/${lineId}/structures/${structureId}`);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }
}

export default LineService; 