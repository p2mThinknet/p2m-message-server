/**
 * Created by colinhan on 07/11/2016.
 */

const co = require('co');
const fs = require('fs');
const path = require('path');

let seeders = fs.readdirSync(__dirname)
    .filter(function (file) {
      return file !== 'index.js' && file.slice(-3) === '.js';
    })
    .sort();

export default co.wrap(function* seeds() {
  for (let i = 0; i < seeders.length; i++) {
    let seeder = path.join(__dirname, seeders[i]);
    let seederFunc = require(seeder);
    yield seederFunc();
  }
});