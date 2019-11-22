import Service from './Service';
import store from '../redux/store';

class StructureService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }

  get = async (projectId, structureId) => {
    try {
      return await this.http.get(`/projects/${projectId}/structures/${structureId}`);
    } catch (error) {
      return error.response;
    }
  };

  list = async (projectId) => {
    try {
      return await this.http.get(`/projects/${projectId}/structures/`);
    } catch (error) {
      return error.response;
    }
  };

  delete = async (projectId, structureId) => {
    try {
      return await this.http.delete(`/projects/${projectId}/structures/${structureId}`);
    } catch (error) {
      return error.response;
    }
  };

  update = async (projectId, structureId, body) => {
    try {
      return await this.http.patch(`/projects/${projectId}/structures/${structureId}/`, body);
    } catch (error) {
      return error.response;
    }
  };

  upload = async (body) => {
    try {
      const config = {     
        headers: { 'content-type': 'multipart/form-data' }
      }
      return await this.http.post(`/upload-structures`, body, config);
    } catch (error) {
      return error.response;
    }
  };

  create = async (projectId, form) => {
    try {
      const url = `projects/${projectId}/structures/`;
      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  };

  getStructureTypes = async (projectId) => {
    try {
        return await this.http.get(`/projects/${projectId}/type-structures/`);
    } catch (error) {
        return error.response;
    }
  }

  addStructureType = async (projectId, body) => {
    try {
        return await this.http.post(`/projects/${projectId}/type-structures/`, body);
    } catch (error) {
        return error.response;
    }
  }

  getPhotos = async (structureId) => {
    try {
        return await this.http.get(`/structures/${structureId}/photos/`);
    } catch (error) {
        return error.response;
    }
  }

  addPhoto = async (structureId, body) => {
    try {
      const config = {     
        headers: { 'content-type': 'multipart/form-data' }
      }
        return await this.http.post(`/structures/${structureId}/photos/`, body, config);
    } catch (error) {
        return error.response;
    }
  }

  deletePhoto = async (structureId, photoId) => {
    try {
        return await this.http.delete(`/structures/${structureId}/photos/${photoId}`);
    } catch (error) {
        return error.response;
    }
  }

  getItems = async (structureId ) => {
    try {
      return await this.http.get(`/structures/${structureId}/items/`);
    } catch (error) {
        return error.response;
    }
  }

  addItem = async (structureId, body) => {
    try {
      return await this.http.post(`/structures/${structureId}/items/`, body );
    } catch (error) {
        return error.response;
    }
  }

  updateItem = async (structureId, itemId, body) => {
    try {
      return await this.http.patch(`/structures/${structureId}/items/${itemId}/`, body );
    } catch (error) {
        return error.response;
    }
  }

  deleteItem = async (structureId, itemId) => {
    try {
        return await this.http.delete(`/structures/${structureId}/items/${itemId}`);
    } catch (error) {
        return error.response;
    }
  }

}

export default StructureService;
