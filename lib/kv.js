
/*!
 * Module dependencies.
 */

var Requestor = require('./requestor');

/**
 * Export `KV`.
 */

module.exports = KV;

/**
 * KV constructor.
 *
 * @param {Consul} consol
 * @constructor
 */

function KV (consul) {
  this.requestor = new Requestor('kv', consul);
}

/**
 * Get `data` from `key`.
 *
 * TODO: options?
 *
 * @param {String} key
 * @param {Function} done
 * @public
 */

KV.prototype.get = function (key, opts, done) {
  if ('function' == typeof opts) done = opts, opts = null;

  this.requestor.get(key, opts, function (err, items) {
    if (err) return done(err);
    if (!items) return done(null, items);

    done(null, items.map(function (item) {
      return {
        createIndex: item['CreateIndex'],
        modifyIndex: item['ModifyIndex'],
        key: item['Key'],
        flags: item['Flags'],
        value: new Buffer(item['Value'], 'base64').toString('utf8')
      };
    }));
  });
};

/**
 * Puts `data` at `key`.
 *
 * TODO: validate `data`
 * TODO: validate `opts.cas`
 * TODO: validate `opts.flags`
 * TODO: serializers for `data`
 *
 * @param {String} key
 * @param {Mixed} data
 * @param {Object} [opts]
 * @param {Function} done
 * @public
 */

KV.prototype.put = function (key, data, opts, done) {
  if ('function' == typeof opts) done = opts, opts = null;
  this.requestor.put(key, data, opts, done);
};

/**
 * DELETE's `key`.
 *
 * TODO: options?
 *
 * @param {String} key
 * @param {Function} done
 * @public
 */

KV.prototype.delete = function (key, opts, done) {
  if ('function' == typeof opts) done = opts, opts = null;
  this.requestor.delete(key, opts, done);
};

/**
 * GET then WATCH a single `key`
 * @param {key} key
 * @param {hanlder}  is called with the current value, then each time the value is changed
 * @returns {Function} until this function is called to stop watching
 */
KV.prototype.watch = function(key, handler) {
  var self = this;
	var shouldStop = false;
  var watchMore = function(index) {
    // get the key, wait up to 10s
		self.get(key, { wait: "10s", index: index }, function(err, res) {
			var newIndex;
			if (!shouldStop) { // do nothing if user has cancelled
				if (err != null) { // in case of error
          handler(err); // call handler with error
					return setTimeout(function() { // but schedule a retry in 1s
						watchMore(index);
					}, 1000);
				}
				newIndex = res[0].modifyIndex;
				if (index !== newIndex) { // the index has changed == data has changed
          handler(null, res); // call handler with new data
				}
				return process.nextTick(function() { // then recurse
					watchMore(newIndex);
				});
			}
		});
	};
	watchMore(0); // index=0 is a good starting point
	return function() { // return a function which will stop watching when called
		shouldStop = true;
	};
};
