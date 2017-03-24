/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const R = require('./relationships');
const Device = require('./Device');
const Message = require('./Message');
const SendRecord = require('./SendRecord');
const PushRecord = require('./PushRecord');

module.exports = {
  Device,
  Message,
  SendRecord,
  PushRecord,
};

R.applyTo(module.exports);
