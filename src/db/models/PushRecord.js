/**
 * Created by colinhan on 17/02/2017..
 */
const Sequelize = require('sequelize');
const Model = require('../sequelize');
const R = require('./relationships');

const PushRecord = Model.define('PushRecord', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  isDelivered: {
    comment: '是否已经发送',
    type: Sequelize.BOOLEAN,
  }

}, {
  comment: '一个PushRecord是一次发送请求对一个设备的一次推送。'
});

R.belongsTo(PushRecord, 'SendRecord');
R.belongsTo(PushRecord, 'Device');

module.exports = PushRecord;