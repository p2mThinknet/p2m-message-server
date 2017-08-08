/**
 * Created by colinhan on 17/02/2017.
 */

import _ from 'lodash';
import co from 'co';
import express from 'express';
import wrap from 'co-express';
import {models} from './db';
import pushService from './service';
import config from 'config';
const logger = require('p2m-common-logger')('message-server');

let router = express.Router();

router.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});


router.get('/', wrap(function*(req, res) {
  let userId = req.query.userId;
  logger.log(`Get messages for user ${userId}`);
  let pageSize = (req.query && req.query.pageSize) || 10;
  let page = (req.query && req.query.page) || 0;
  let offset = page * pageSize;
  let options = {
    where: {
      targetUserId: userId,
      isDeleted: false,
    },
    include: [{
      model: models.SendRecord,
      required: true,
      //limit: 1,
      where: {
        isAlive: true,
        isSent: true
      },
      attributes: ['id', 'isRead'],
    }]
  };
  let result;
  if (req.query.filter === 'unread') {
    options.include[0].where.isRead = false;

    result = yield models.Message.findAndCount({
      ...options,
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });
  } else {
    let rows = yield models.Message.findAll({
      ...options,
      limit: pageSize,
      offset: offset,
      order: [
        [models.SendRecord, 'isRead'],
        ['id', 'DESC']
      ],
    });
    options.include[0].where.isRead = false;
    let count = yield models.Message.count(options);
    if (rows && rows.length) {
      result = {count, rows};
    }
  }
  if (result && result.rows.length) {
    res.json({
      count: result.count,
      messages: result.rows.map(m => {
        let {id, SendRecords, content, ...d} = m.toJSON();
        let isRead = _.every(SendRecords, (s) => s.isRead);
        return {
          msgId: id,
          sendId: SendRecords[0].id,
          isRead,
          content: JSON.parse(content),
          ...d,
        };
      })
    });
  } else {
    res.json({count: 0, messages: []});
  }
}));

// Get unread count.
router.get('/unread-count', wrap(function*(req, res) {
  let userId = req.query.userId;
  logger.log(`Get unread count for user ${userId}`);
  let result = yield models.Message.count({
    where: {
      targetUserId: userId,
      isDeleted: false,
    },
    include: [{
      model: models.SendRecord,
      required: true,
      where: {
        isRead: false,
        isAlive: true,
        isSent: true,
      },
    }],
  });

  res.json({count: result});
}));

// Register device.
router.post('/register', wrap(function*(req, res) {
  let {userId, deviceId, channel} = req.body;
  logger.log('Client ask to register a new device. "%j"', req.body);

  yield models.Device.findOrCreate({where: {userId, deviceId, channel}});
  res.json({success: true});
}));

router.post('/unregister', wrap(function*(req, res) {
  let {userId, deviceId, channel} = req.body;
  logger.log('Client ask to unregister device. "%j"', req.body);

  yield models.Device.destroy({
    where: {userId, deviceId, channel}
  });

  res.json({success: true});
}));

// send a message to user.
router.post('/send', wrap(function*(req, res) {
  let data = req.body;
  logger.log('Client ask to send message "%j"', data);

  if (data.targetUserId === '*') {
    let userIds = _.uniq(_.map(yield models.Device.findAll({
      attributes: ['userId'],
    }), 'userId'));

    yield Promise.all(_.map(userIds, userId=>co(sendToUser(userId, data))));
  } else {
    yield co(sendToUser(data.targetUserId, data));
  }

  yield pushService.forceRun();

  res.json({success: true});
}));

function *sendToUser(userId, message) {
  let m = yield models.Message.create({
    targetUserId: userId,
    sourceUserId: message.sourceUserId,
    title: message.title,
    description: message.description,
    content: JSON.stringify(message.content),
    priority: message.priority,
    kind: message.kind,
  });

  yield m.createSendRecord({
    schedule: message.schedule ? new Date(message.schedule) : new Date()
  });
}

// Make pushRecord as delivered.
router.post('/delivered', wrap(function*(req, res) {
  let {pushId} = req.body;
  logger.log('A message "%j" is delivered', {pushId});

  let push = yield models.PushRecord.findById(pushId);
  if (push) {
    push.isDelivered = true;
    yield push.save();
  } else {
    let error = `Message with pushId "${pushId}" is not found.`
    logger.error(error);
    res.json({success: false, error})
  }

  res.json({success: true});
}));

// Make sendRecord as read.
router.post('/read', wrap(function*(req, res) {
  let {sendId} = req.body;
  logger.log('User ask to make message "%j" as read', {sendId});

  let s = yield models.SendRecord.findById(sendId);
  if (s) {
    if (s.isRead) {
      res.json({success: false, error: `The message with sendId "${sendId}" is already read.`});
      return;
    }

    s.isRead = true;
    yield s.save();
    res.json({success: true});
  } else {
    let error = `Message with sendId "${sendId}" is not found.`
    logger.error(error);
    res.json({success: false, error});
  }
}));

// Delay a message to future.
router.post('/delay', wrap(function*(req, res) {
  let {sendId, schedule} = req.body;
  logger.log('User ask to delay message "%j" to "%s"', {sendId}, schedule);

  let s = yield models.SendRecord.findById(sendId);
  if (s) {
    s.isRead = true;
    s.isAlive = false;
    yield s.save();

    let m = yield s.getMessage();
    yield m.createSendRecord({
      schedule: new Date(schedule)
    });
    res.json({success: true});
  } else {
    let error = `Message with sendId "${sendId}" is not found.`
    logger.error(error);
    res.json({success: false, error})
  }
}));


export default {path: config.server.path, router};
