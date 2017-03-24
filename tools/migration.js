/**
 * Created by colinhan on 07/11/2016.
 */

import co from 'co'
import Sequelize from 'sequelize'
import QueryInterface from 'sequelize/lib/query-interface'
//noinspection SpellCheckingInspection
import Umzug from 'umzug'
import path from 'path'
import yargs from 'yargs';
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

export function up(argv) {
  console.log(`Upward database to version: ${argv.target}`);
  //noinspection JSUnresolvedFunction
  co(function*() {
    yield umzug.up(argv.target === '@' ? {} : {to: argv.target});
    yield seeders();
  }).catch(console.error);
}

export function down(argv) {
  console.log(`Downward database to version: ${argv.target}`);
  umzug.down({to: argv.target});
}

if (!module.parent) {
  let argv = yargs
      .usage('Usage: $0 <command> [options]')
      .command(['up', '*'], 'upward database to newer state.', {
        target: {
          alias: 't',
          default: '@',
          describe: 'target version to upward to.'
        }
      }, up)
      .command('down', 'downward database to older state.', {
        target: {
          alias: 't',
          describe: 'target version to downward to.'
        }
      }, down)
      .help()
      .argv;
}