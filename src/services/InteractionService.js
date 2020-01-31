import Service from "./Service";

class InteractionService extends Service {

  async list(projectId) {
    try {
      return await this.http.get(`/projects/${projectId}/interactions`);
    } catch (error) {
      return error.response;
    }
  }


  async get(projectId, interactionId) {
    try {
      const url = `/projects/${projectId}/interactions/${interactionId}/`;
      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  }

  async create(projectId, body = {}) {
    try {
      return await this.http.post(`/projects/${projectId}/interactions/`, body);
    } catch (error) {
      console.log('service', error);
      return error.response;
    }
  }

  async update(projectId, id, body = {}) {
    try {
      const url = `/projects/${projectId}/interactions/${id}/`;
      return await this.http.patch(url, body);
    } catch (error) {
      return error.response;
    }
  }

  async delete(projectId, id) {
    try {
      const url = `/projects/${projectId}/interactions/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  }
}

export default InteractionService;