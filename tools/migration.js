/**
 * Created by colinhan on 07/11/2016.
 */

const co = require('co');
const fs = require('fs');
const Sequelize = require('sequelize');
const QueryInterface = require('sequelize/lib/query-interface');
const Umzug = require('umzug');
const path = require('path');
const sequelize = require('../src/db/sequelize');
const seeders = require('../src/db/seeders');

const queryInterface = new QueryInterface(sequelize);

var umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },
  logging: false,
  upName: 'up',
  downName: 'down',
  migrations: {
    params: [queryInterface, Sequelize],
    path: path.join(__dirname, '../src/db/migrations'),
    pattern: /^\d+[\w-]+\.js$/,
    wrap: function(fun) {return fun;}
  }
});

function up() {
  co(function*() {
    yield umzug.up({});
    yield seeders();
  }).catch(console.error);
}

function down() {
  umzug.down({});
}

module.exports = {up, down};

if (!module.parent) {
  up();
}