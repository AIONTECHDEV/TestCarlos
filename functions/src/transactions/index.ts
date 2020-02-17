export { };
const Server = require('./../helpers/server');
const routes = require('./routes');

module.exports = Server.create(routes);