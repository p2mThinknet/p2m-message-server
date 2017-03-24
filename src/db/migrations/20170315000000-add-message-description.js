'use strict';

const co = require('co');

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(
        co.wrap(function*(t) {
          yield queryInterface.addColumn('Message', 'description', {
            comment: '消息描述，会被显示在手机的通知栏中。',
            type: Sequelize.STRING,
            allowNull: true,
          }, {transaction: t});
          //throw new Error('aaaa');
          yield queryInterface.sequelize.query('UPDATE Message SET description=""', {transaction: t});
          yield queryInterface.changeColumn('Message', 'description', {
            comment: '消息描述，会被显示在手机的通知栏中。',
            type: Sequelize.STRING,
            allowNull: false,
          }, {transaction: t})
        })
    );
  },

  down: co.wrap(function* down(queryInterface, Sequelize) {
    yield queryInterface.removeColumn('Message', 'description');
  })
};
