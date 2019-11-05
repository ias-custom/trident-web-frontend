import Service from './Service';
import store from '../redux/store';

class SpanService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }

  create = async (projectId, form) => {
    try {
      const url = `projects/${projectId}/spans/`;

      return await this.http.post(url, form);
    } catch (error) {
      return error.response;
    }
  };

  get = async (projectId, spanId) => {
    try {
      return await this.http.get(`/projects/${projectId}/spans/${spanId}`);
    } catch (error) {
      return error.response;
    }
  };

  list = async (projectId) => {
    try {
      return await this.http.get(`/projects/${projectId}/spans/`);
    } catch (error) {
      return error.response;
    }
  };

  update = async (projectId, spanId, body) => {
    try {
      return await this.http.patch(`/projects/${projectId}/spans/${spanId}/`, body);
    } catch (error) {
      return error.response;
    }
  };

  delete = async (projectId, spanId) => {
    try {
      return await this.http.delete(`/projects/${projectId}/spans/${spanId}`);
    } catch (error) {
      return error.response;
    }
  };


  // SPAN TYPES
  getSpanTypes = async (projectId) => {
    try {
        return await this.http.get(`/projects/${projectId}/span-types/`);
    } catch (error) {
        return error.response;
    }
  }

  addSpanType = async (projectId, body) => {
    try {
        return await this.http.post(`/projects/${projectId}/span-types/`, body);
    } catch (error) {
        return error.response;
    }
  }


  //PHOTOS
  getPhotos = async (spanId) => {
    try {
        return await this.http.get(`/spans/${spanId}/photos/`);
    } catch (error) {
        return error.response;
    }
  }

  addPhoto = async (spanId, body) => {
    try {
      const config = {     
        headers: { 'content-type': 'multipart/form-data' }
      }
        return await this.http.post(`/spans/${spanId}/photos/`, body, config);
    } catch (error) {
        return error.response;
    }
  }

  deletePhoto = async (spanId, photoId) => {
    try {
        return await this.http.delete(`/spans/${spanId}/photos/${photoId}`);
    } catch (error) {
        return error.response;
    }
  }


  // ITEMS
  getItems = async (spanId ) => {
    try {
      return await this.http.get(`/spans/${spanId}/items/`);
    } catch (error) {
        return error.response;
    }
  }

  addItem = async (spanId, body) => {
    try {
      return await this.http.post(`/spans/${spanId}/items/`, body );
    } catch (error) {
        return error.response;
    }
  }

  updateItem = async (spanId, itemId, body) => {
    try {
      return await this.http.patch(`/spans/${spanId}/items/${itemId}/`, body );
    } catch (error) {
        return error.response;
    }
  }

  deleteItem = async (spanId, itemId) => {
    try {
        return await this.http.delete(`/spans/${spanId}/items/${itemId}`);
    } catch (error) {
        return error.response;
    }
  }


  // MARKINGS
  getMarkings = async (spanId ) => {
    try {
      return await this.http.get(`/spans/${spanId}/markings/`);
    } catch (error) {
        return error.response;
    }
  }

  getMarking = async (spanId, markingId ) => {
    try {
      return await this.http.get(`/spans/${spanId}/markings/${markingId}`);
    } catch (error) {
        return error.response;
    }
  }

  addMarking = async (spanId, form ) => {
    try {
      return await this.http.post(`/spans/${spanId}/markings/`, form);
    } catch (error) {
        return error.response;
    }
  }

  updateMarking = async (spanId, markingId, form ) => {
    try {
      return await this.http.patch(`/spans/${spanId}/markings/${markingId}`, form);
    } catch (error) {
        return error.response;
    }
  }

  deleteMarking = async (spanId, markingId ) => {
    try {
      return await this.http.delete(`/spans/${spanId}/markings/${markingId}`);
    } catch (error) {
        return error.response;
    }
  }


  // ACCESS
  getAccessDetail = async (spanId, accessId) => {
    try {
      return await this.http.get(`/spans/${spanId}/access/${accessId}`);
    } catch (error) {
        return error.response;
    }
  }

  getAccess = async (spanId ) => {
    try {
      return await this.http.get(`/spans/${spanId}/access/`);
    } catch (error) {
        return error.response;
    }
  }

  addAccess = async (spanId, form ) => {
    try {
      return await this.http.post(`/spans/${spanId}/access/`, form);
    } catch (error) {
        return error.response;
    }
  }

  updateAccess = async (spanId, accessId, form ) => {
    try {
      return await this.http.patch(`/spans/${spanId}/access/${accessId}`, form);
    } catch (error) {
        return error.response;
    }
  }

  deleteAccess = async (spanId, accessId ) => {
    try {
      return await this.http.delete(`/spans/${spanId}/access/${accessId}`);
    } catch (error) {
        return error.response;
    }
  }

}

export default SpanService;
