
/*!
 * Module dependencies.
 */

var Requestor = require('./requestor');

/**
 * Export `Health`.
 */

module.exports = Health;

/**
 * Health constructor.
 *
 * @param {Consul} consol
 * @constructor
 */

function Health (consul) {
  this.requestor = new Requestor('health', consul);
}
