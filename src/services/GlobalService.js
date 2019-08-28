import Service from "./Service";

class GlobalService extends Service {

    async getStates() {
        try {
            return await this.http.get('/states/');
        } catch (error) {
            return error.response;
        }
    }

}

export default GlobalService;