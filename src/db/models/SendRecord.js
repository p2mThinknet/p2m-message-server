/**
 * Created by colinhan on 17/02/2017..
 */
import Sequelize from 'sequelize';
import Model from '../sequelize';
import R from './relationships';

const SendRecord = Model.define('SendRecord', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  schedule: {
    comment: '计划发送时间',
    type: Sequelize.TIME,
    allowNull: true,
  },

  isSent: {
    comment: '是否已经发送',
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isRead: {
    comment: '是否已读',
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isAlive: {
    comment: '是否仍然有效，用户Delay一个消息的时候，上一次的SendRecord就会变成无效的，避免用户的消息历史中一个消息出现多次。',
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  }

}, {
  comment: '一个消息可能对应多个SendRecord，用户发送消息或点击一个消息的延后处理后都会产生新的SendRecord.'
});

R.belongsTo(SendRecord, 'Message');
R.hasMany(SendRecord, "PushRecord");

export default SendRecord;