import Service from "./Service";

class RoleService extends Service {

    async list() {
        try {
            return await this.http.get('/roles/');
        } catch (error) {
            return error.response;
        }
    }
}

export default RoleService;