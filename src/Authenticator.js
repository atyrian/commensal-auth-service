const jwt = require('jsonwebtoken');
const moment = require('moment');
const AWS = require('aws-sdk');
const common = require('commensal-common');

module.exports = class Authenticator {
  async getFBUser(fbToken) {
    const token = fbToken.replace(/Bearer/g, '').trim();
    let response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}&fields=name,gender,birthday`,
    );
    if (response.status === 200) {
      response = await response.json();
      return response;
    }

    throw new common.errors.HttpError('Authentication failed', 401);
  }

  async generateToken(user, type) {
    const ssm = new AWS.SSM();
    const cert = await ssm.getParameters({ Names: ['jwtRS256.key'] }).promise();
    const payload = {
      iss: process.env.SCOPE_ID,
      sub: type === 'user' ? user.id : process.env.SCOPE_ID,
      exp: type === 'user' ? moment().unix() + 604800 : moment().unix() + 3600, // 1 week || 1 hour
      aut: type === 'user' ? 'user' : 'service',
    };
    const token = jwt.sign(payload, cert.Parameters[0].Value, { algorithm: 'RS256' });
    return token;
  }
};
