const common = require('commensal-common');

module.exports = class UserHandler {
  constructor(serviceToken) {
    this.serviceToken = serviceToken;
  }

  async getUser(userId) {
    try {
      const url = `${process.env.API_URL}/${userId}`;
      const response = await fetch(url, { headers: { Authorization: `${this.serviceToken}` } });
      if (response.status !== 200) {
        throw new common.errors.HttpError(response.statusText, response.status);
      }

      const user = await response.json();
      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createUser(fbUser) {
    try {
      const url = `${process.env.API_URL}/${fbUser.id}`;
      const response = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${this.serviceToken}`,
        },
        body: JSON.stringify(fbUser),
      });
      if (response.status !== 200) {
        return Promise.reject(new common.errors.HttpError(response.statusText, response.status));
      }

      const data = await response.json();
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
