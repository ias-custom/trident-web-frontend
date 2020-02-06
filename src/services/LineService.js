import Service from "./Service";

class LineService extends Service {

  async list() {
    try {
      return await this.http.get(`/lines/`);
    } catch (error) {
      return error.response;
    }
  }

  async get(id) {
    try {
      const url = `/lines/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  }

  async create(body = {}) {
    try {
      return await this.http.post(`/lines/`, body);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async update(id, body = {}) {
    try {
      const url = `/lines/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  }

  async delete(id) {
    try {
      const url = `/lines/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  }
}

export default LineService; 