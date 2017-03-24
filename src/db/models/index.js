/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import R from './relationships';
import Device from './Device';
import Message from './Message';
import SendRecord from './SendRecord';
import PushRecord from './PushRecord';

const models = {
  Device,
  Message,
  SendRecord,
  PushRecord,
};

R.applyTo(models);

export default models;
