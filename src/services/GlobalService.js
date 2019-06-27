import Service from "./Service";

class GlobalService extends Service {

    async states() {
        try {
            return await this.http.get('/usa_states/');
        } catch (error) {
            return error.response;
        }
    }
}

export default GlobalService;