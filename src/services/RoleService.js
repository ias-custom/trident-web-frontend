import Service from "./Service";

class RoleService extends Service {

    async list() {
        try {
            return await this.http.get('/groups/');
        } catch (error) {
            return error.response;
        }
    }
    async get(id) {
      try {
        const url = `/roles/${id}/`;
        return await this.http.get(url);
      } catch (error) {
        return error.response;
      }
    }

    async create(body = {}) {
      try {
        return await this.http.post('/roles/', body);
      } catch (error) {
        return error.response;
      }
    }

    async update(id, body = {}) {
      try {
        const url = `/${id}/`;
        return await this.http.patch(url, body);
      } catch (error) {
        return error.response;
      }
    }

    async delete(id) {
      try {
        const url = `/groups/${id}/`;
        return await this.http.delete(url);
      } catch (error) {
        return error.response;
      }
    }
}

export default RoleService;
