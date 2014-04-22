
/*!
 * Module dependencies.
 */

var Requestor = require('./requestor');

/**
 * Export `Catalog`.
 */

module.exports = Catalog;

/**
 * Catalog constructor.
 *
 * @param {Consul} consol
 * @constructor
 */

function Catalog (consul) {
  this.requestor = new Requestor('catalog', consul);
}
