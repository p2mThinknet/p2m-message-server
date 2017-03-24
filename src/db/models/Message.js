/**
 * Created by colinhan on 17/02/2017..
 */
import Sequelize from 'sequelize';
import Model from '../sequelize';
import R from './relationships';

const Message = Model.define('Message', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  targetUserId: {
    comment: '目标用户id',
    type: Sequelize.UUID,
    allowNull: false,
  },
  sourceUserId: {
    comment: '消息发送者id',
    type: Sequelize.UUID,
    allowNull: true, // 系统自动发送的消息，发送者为空。
  },
  title: {
    comment: '消息标题',
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    comment: '消息数据，JSON格式描述',
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    comment: '消息描述，会被显示在手机的通知栏中。',
    type: Sequelize.STRING,
    allowNull: false,
  },
  kind: {
    comment: '消息类别，客户端根据该类别信息决定使用哪个模板展示这个消息。',
    type: Sequelize.STRING,
    allowNull: false,
  },
  priority: {
    comment: '消息优先级',
    type: Sequelize.ENUM('none', 'urgent', 'high', 'middle', 'low', 'optional'),
    allowNull: false,
  },
  isDeleted: {
    comment: '是否已删除',
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  expired: {
    comment: '过期时间',
    type: Sequelize.DATE,
  }

}, {});

R.hasMany(Message, "SendRecord");

export default Message;