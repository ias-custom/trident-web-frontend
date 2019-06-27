import Service from "./Service";

class AuthService extends Service {

  async login(username, password) {
    try {
      const body = {username, password};
      return await this.http.post('/login/', body);
    } catch (error) {
      return error.response;
    }
  }

  async forgotPassword(email) {
    try {
      const body = {email};
      return await this.http.post('/forgot-password/', body);
    } catch (error) {
      return error.response;
    }
  }

  async resetPassword(body = {}) {
    try {
      return await this.http.post('/reset-password/', body);
    } catch (error) {
      return error.response;
    }
  }

  async refreshToken(token) {
    try {
      return await this.http.post('/refresh-token/', {token});
    } catch (error) {
      return error.response;
    }
  }
}

export default AuthService;