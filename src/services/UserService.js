import Service from "./Service";

class UserService extends Service {

  async list() {
    try {
      return await this.http.get('/users/');
    } catch (error) {
      return error.response;
    }
  }

  async get(id) {
    try {
      const url = `/users/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  }

  async create(body = {}) {
    try {
      return await this.http.post('/users/', body);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async update(id, body = {}) {
    try {
      const url = `/users/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  }

  async delete(id) {
    try {
      const url = `/users/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  }
}

export default UserService;