/**
 * Created by colinhan on 17/02/2017.
 */

import Promise from 'promise';
import co from 'co';
import {models} from './db';
import config from 'config';

const logger = require('p2m-common-logger')('message-server');

function* forceRun() {
  logger.log('forceRun start');
  yield* loop();
  logger.log('forceRun success.');
}
function* intervalRun() {
  yield* loop();
  setTimeout(co.wrap(intervalRun), config.pushService.interval)
}

function* loop() {
  logger.log('Starting a loop...');
  let sends = yield models.SendRecord.findAll({
    where: {
      isSent: false,
      schedule: {$lte: new Date()}
    },
    include: [{
      model: models.Message,
      where: {isDeleted: false},
      required: true
    }]
  });

  yield Promise.all(sends.map(sendOne));
  logger.log('Loop done.')
}

function sendOne(s) {
  return co(function*() {
    s.isSent = true;
    yield s.save();

    yield Promise.all(channels.map(function (c) {
      return sendToChannel(c, s);
    }));
  });
}

function sendToChannel(channel, sendRecord) {
  return co(function*() {
    logger.log('Send message through channel "%s".', channel.channelId);
    let devices = models.Device.findAll({
      where: {
        channel: channel.channelId,
        userId: sendRecord.Message.targetUserId,
        isDeleted: false,
      },
    });

    yield Promise.all(devices.map(function (d) {
      return sendToDevice(channel, d, sendRecord);
    }));
  })
}

function sendToDevice(channel, device, sendRecord) {
  return co(function*() {
    logger.log('Send message to device "%j".', device);
    let push = yield sendRecord.createPushRecord({
      DeviceId: device.id
    });
    let {id, content, ...msg} = sendRecord.Message.toJSON();
    yield channel.send(device, {
      msgId: id,
      sendId: sendRecord.id,
      pushId: push.id,
      content: JSON.parse(content),
      ...msg,
    });
  });
}

let timer;
function start(app, server) {
  logger.log('Starting push service...');
  if (timer) {
    logger.warn('Push service was started.');
  }

  // start all channels
  channels.map(c=>c.start(app, server));

  co(intervalRun);
}

function stop() {
  logger.log('Stopping socket service...');
  if (!timer) {
    logger.warn('Socket service is not start.');
    return;
  }

  clearTimeout(timer);

  channels.map(c=>c.stop());
}

let channels = [];
function use(channel) {
  channels.push(channel);
  return this;
}

module.exports = {
  forceRun: co.wrap(forceRun),
  start,
  stop,
  use,
};