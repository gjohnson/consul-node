
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
 * @param {Consul} consul
 * @constructor
 */

function Catalog (consul) {
  this.requestor = new Requestor('catalog', consul);
}

/**
 * Lists the services in a catalog.
 *
 * @param {Object} [opts]
 * @param {Function} done
 */
Catalog.prototype.services = function(opts, done) {
    if ('function' == typeof opts) done = opts, opts = null;

    this.requestor.get('services', opts, done);
};

/**
 * Lists the nodes in a given service.
 *
 * @param {String} service
 * @param {Object} [opts]
 * @param {Function} done
 */
Catalog.prototype.service = function(service, opts, done) {
    if ('function' == typeof opts) done = opts, opts = null;

    this.requestor.get('service/' + service, opts, done);
};
