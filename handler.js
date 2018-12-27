const common = require('commensal-common');
const AuthenticationHttpHandler = require('./src/AuthenticationHttpHandler');

module.exports.authenticateGet = common.aws.lambdaWrapper((event) => {
  const authenticationHttpHandler = new AuthenticationHttpHandler(event);
  return authenticationHttpHandler.get();
});
