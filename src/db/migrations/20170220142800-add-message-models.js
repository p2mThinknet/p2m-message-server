'use strict';

const co = require('co');

module.exports = {
  up: co.wrap(function* up(queryInterface, Sequelize) {
    yield queryInterface.createTable(
        'Device',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },

          deviceId: {
            comment: `设备id，这个id信息来自于具体的推送渠道`,
            type: Sequelize.STRING,
            allowNull: false,
          },

          channel: {
            comment: '设备所属渠道',
            type: Sequelize.STRING,
            allowNull: false,
          },

          userId: {
            comment: '设备所属用户',
            type: Sequelize.UUID,
            allowNull: false,
          },

          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE
        }
    );
    yield queryInterface.createTable(
        'Message',
        {
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
          },

          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE
        }
    );
    yield queryInterface.createTable(
        'SendRecord',
        {
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
          },

          MessageId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'Message',
              key: 'id',
            }
          },

          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE
        }
    );
    yield queryInterface.createTable(
        'PushRecord',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },

          isDelivered: {
            comment: '是否已经发送',
            type: Sequelize.BOOLEAN,
          },

          SendRecordId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'SendRecord',
              key: 'id',
            }
          },
          DeviceId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'Device',
              key: 'id',
            }
          },

          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE
        }
    );
  }),

  down: co.wrap(function* down(queryInterface, Sequelize) {
    yield queryInterface.dropTable('PushRecord');
    yield queryInterface.dropTable('SendRecord');
    yield queryInterface.dropTable('Message');
    yield queryInterface.dropTable('Device');
  })
};
