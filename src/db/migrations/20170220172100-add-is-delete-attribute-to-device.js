'use strict';

const co = require('co');

module.exports = {
  up: co.wrap(function* up(queryInterface, Sequelize) {
    yield queryInterface.addColumn('Device', 'isDeleted', {
      comment: '设备已经被删除',
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  }),

  down: co.wrap(function* down(queryInterface, Sequelize) {
    yield queryInterface.removeColumn('Device', 'isDeleted');
  })
};
