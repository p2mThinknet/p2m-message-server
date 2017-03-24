/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Sequelize from 'sequelize';
import Config from 'config';
import _ from 'lodash';

export default new Sequelize(_.assign({}, Config.get('database'), {
  define: {
    freezeTableName: true,
  }
}));
