import Service from './Service';

class CustomerService extends Service {

  async list() {
    try {
      return await this.http.get('/customers/');
    } catch (error) {
      return error.response;
    }
  }

  async get(id) {
    try {
      const url = `/customers/${id}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  }

  async create(body = {}) {
    try {
      return await this.http.post('/customers/', body);
    } catch (error) {
      return error.response;
    }
  }

  async update(id, body = {}) {
    try {
      const url = `/customers/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  }

  async delete(id) {
    try {
      const url = `/customers/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  }
}

export default CustomerService;
