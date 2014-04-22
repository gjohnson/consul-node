
# consul-node

A node.js client library for [consul](http://www.consul.io/)

This module attempts to be "low level" and follows consul's API pretty closely, meaning not a whole lot of sugar is provided for you. If you need something small, sugary and focused, use this module to build something higher level.

## Warning

This not stable because is still being developed, feel free to help out!

## Install

```sh
$ npm install consul-node
```

## Configure

The following options can be passed to the `Consul` constructor.

  - `host` -- The consul agent's host (defaults to `localhost`).
  - `port` -- The consul agent's port (defaults to `8500`).
  - `secure` -- Use https when talking to the agent (defaults to `false`).
  - `strict` -- Treat HTTP 404's as errors (defaults to `false`).

```js
var Consul = require('consul-node');

var consul = new Consul({
  host: 'localhost',
  port: 8300,
});
```

## KV API

Implements the [KV](http://www.consul.io/docs/agent/http.html#toc_2) endpoints.

  - consul.kv.get(key, callback)
  - consul.kv.put(key, data, callback)
  - consul.kv.delete(key, callback)

TODO: flags, cas, recurse, blocking queries.

```js
var consul = new Consul();

consul.kv.put('hello', 'world', function (err, ok) {
  if (err) throw err;
  consul.kv.get('hello', function (err, items) {
    if (err) throw err;
    console.log(items);
  });
});
```

## Status API

Implements the [status](http://www.consul.io/docs/agent/http.html#toc_29) endpoints.

  - consul.status.leader(callback)
  - consul.status.peers(callback)

```js
var consul = new Consul();

consul.status.peers(function (err, peers) {
  if (err) throw err;
  console.log('peers -- %j', peers);
});

consul.status.leader(function (err, leader) {
  if (err) throw err;
  console.log('leader -- %s', leader);
});
```

## Agent API

Implements the [agent](http://www.consul.io/docs/agent/http.html#toc_3) endpoints.

  - consul.agent.checks(callback)
  - consul.agent.services(callback)
  - consul.agent.members(callback)

TODO: everything else...

```js
var consul = new Consul();

consul.agent.checks(function (err, checks) {
  if (err) throw err;
  console.log('checks -- %j', checks);
});

consul.agent.services(function (err, services) {
  if (err) throw err;
  console.log('services -- %j', services);
});

consul.agent.members(function (err, members) {
  if (err) throw err;
  console.log('members -- %j', members);
});
```

### Catalog API

Implements the [catalog](http://www.consul.io/docs/agent/http.html#toc_16) endpoints.

TODO: everything...

### Health API

Implements the [health](http://www.consul.io/docs/agent/http.html#toc_24) endpoints.

TODO: everything...

