import Service from './Service';

class ProjectService extends Service {

  list = async () => {
    try {
      return await this.http.get('/projects/');
    } catch (error) {
      return error.response;
    }
  };

  create = async form => {
    try {
      const headers = { 'content-type': 'multipart/form-data' };

      return await this.http.post('/projects/', form, { headers });
    } catch (error) {
      return error.response;
    }
  };

  update = async (id, form) => {
    try {
      const headers = { 'content-type': 'multipart/form-data' };
      const url = `/projects/${id}/`;

      return await this.http.patch(url, form, { headers });
    } catch (error) {
      return error.response;
    }
  };

  get = async id => {
    try {
      const url = `/projects/${id}/`;

      return await this.http.get(url);
    } catch (error) {
      return error.response;
    }
  };

  delete = async id => {
    try {
      const url = `/projects/${id}/`;
      return await this.http.delete(url);
    } catch (error) {
      return error.response;
    }
  };
}

export default ProjectService;
