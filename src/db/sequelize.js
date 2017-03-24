/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const Sequelize = require('sequelize');
const Config = require('config');
const _ = require('lodash');

const sequelize = new Sequelize(_.assign({}, Config.get('database'), {
  define: {
    freezeTableName: true,
  }
}));

module.exports = sequelize;
