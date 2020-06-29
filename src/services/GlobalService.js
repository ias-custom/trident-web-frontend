import Service from "./Service";
import store from "../redux/store";

class GlobalService extends Service {

  getCustomerSelectedId () {
    return store.getState().customers.customerSelectedId
  }
  
  async getAll(statusList, typesList, projectIdList , itemsList, deficienciesList) {
    try {
      return await this.http.get(`/customer-maps/${this.getCustomerSelectedId()}/`, {
        params: {
          status: statusList,
          type: typesList,
          projectId: projectIdList,
          items: itemsList,
          deficiency: deficienciesList
        }
      });
    } catch (error) {
      return error.response;
    }
  }

  async getStates() {
    try {
      return await this.http.get("/states/");
    } catch (error) {
      return error.response;
    }
  }

  async getItemStates() {
    try {
      return await this.http.get("/item-states/");
    } catch (error) {
      return error.response;
    }
  }

  async addDeficiencyItem(itemId, form) {
    try {
      return await this.http.post(`/items/${itemId}/deficiencies/`, form);
    } catch (error) {
      return error.response;
    }
  }

  async deleteDeficiencyItem(itemId, deficiencyId) {
    try {
      return await this.http.delete(
        `/items/${itemId}/deficiencies/${deficiencyId}`
      );
    } catch (error) {
      return error.response;
    }
  }

  async updateDeficiencyItem(itemId, deficiencyId, form) {
    try {
      return await this.http.patch(
        `/items/${itemId}/deficiencies/${deficiencyId}/`,
        form
      );
    } catch (error) {
      return error.response;
    }
  }

  async getInspections() {
    try {
      return await this.http.get("/default-inspections/");
    } catch (error) {
      return error.response;
    }
  }
}

export default GlobalService;
