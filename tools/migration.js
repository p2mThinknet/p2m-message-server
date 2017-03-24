/**
 * Created by colinhan on 07/11/2016.
 */

import co from 'co'
import Sequelize from 'sequelize'
import QueryInterface from 'sequelize/lib/query-interface'
//noinspection SpellCheckingInspection
import Umzug from 'umzug'
import path from 'path'
import sequelize from '../src/db/sequelize'
import seeders from '../src/db/seeders'

const queryInterface = new QueryInterface(sequelize);

//noinspection SpellCheckingInspection
const umzug = new Umzug({
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
    wrap: function (fun) {
      return fun;
    }
  }
});

export function up() {
  //noinspection JSUnresolvedFunction
  co(function*() {
    yield umzug.up({});
    yield seeders();
  }).catch(console.error);
}

export function down() {
  umzug.down({});
}

if (!module.parent) {
  up();
}