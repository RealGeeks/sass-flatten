'use strict';

var read = require('fs').readFileSync;
var test = require('tape');
var flatten = require('./');

test('Flatten', function (assert) {
  assert.plan(1);

  assert.equal(
    flatten(read('./fixtures/input.scss', 'utf8'), './fixtures/'),
    read('./fixtures/expected.scss', 'utf8')
  );
});

test('Flatten fails on an unresolved import', function (assert) {
  assert.plan(1);

  assert.throws(function () {
    flatten(read('./fixtures/input.1.scss', 'utf8'), './fixtures/')
  });
});
