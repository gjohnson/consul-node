
var Consul = require('..');
var assert = require('assert');

describe.only('consul.kv', function () {

  describe('#get', function () {
    describe('when not in "strict mode"', function () {
      var consul = new Consul();
      it('gets undefined from a missing key', function (done) {
        consul.kv.get('missing-1', function (err, host) {
          if (err) return done(err);
          assert(host === undefined);
          done();
        });
      });
    });

    describe('when in "strict mode"', function () {
      var consul = new Consul({ strict: true });
      it('gets an error from a missing key', function (done) {
        consul.kv.get('missing-1', function (err, host) {
          assert(err instanceof Error);
          assert(err.message === 'not found');
          assert(err.code === 404);
          done();
        });
      });
    });
  });

  describe('#put', function () {
    describe('when the key does not exist yet', function () {
      var consul = new Consul();
      it('creates it', function (done) {
        consul.kv.put('hello', 'world', function (err, ok) {
          if (err) return done(err);
          assert(ok === true);
          consul.kv.get('hello', function (err, values) {
            if (err) return done(err);
            assert(Array.isArray(values));
            assert(values.length === 1);
            values.forEach(function (value) {
              assert(value.key === 'hello');
              assert(value.value === 'world');
            });
            done();
          });
        });
      });
    });
  });

  describe('#watch', function() {
    var consul = new Consul();
    it('calls back immediately with value', function (done) {
      var stop = consul.kv.watch('hello', function (err, values) {
        if (err) return done(err);
        assert(Array.isArray(values));
        assert(values.length === 1);
        values.forEach(function (value) {
          assert(value.key === 'hello');
          assert(value.value === 'world');
        });
        stop();
        done();
      });
    });

    it('calls back again if value is changed', function (done) {
      this.timeout(12000);
      var count = 0;
      var stop = consul.kv.watch('hello', function (err, values) {
        count++;
        if (err) return done(err);
        switch (count) {
          case 1:
            assert(values[0].key === 'hello');
            assert(values[0].value === 'world');
            consul.kv.put('hello','all', function (err) { // change value, handler will be called again
              if (err) return done(err);
            });
            break;
          case 2:
            assert(values[0].key === 'hello');
            assert(values[0].value === 'all');
            stop();
            done();
        }
      });
    });

    it('retries http calls after 10s', function (done) {
      this.timeout(12000);
      var count = 0;
      var stop = consul.kv.watch('hello', function (err, values) {
        count++;
        if (err) return done(err);
        switch (count) {
          case 1:
            assert(values[0].key === 'hello');
            assert(values[0].value === 'all');
            consul.kv.put('hello','world', function (err) { // change value, handler will be called again
              if (err) return done(err);
            });
            break;
          case 2:
            assert(values[0].key === 'hello');
            assert(values[0].value === 'world');
            setTimeout(function() {
              consul.kv.put('hello','again', function (err) { // change value back, handler will be called again
                if (err) return done(err);
              });
            }, 10500);
            break;
          case 3:
            assert(values[0].key === 'hello');
            assert(values[0].value === 'again');
            stop();
            done();
        }
      });
    });

  });
});
