/**
 * Created by colinhan on 28/03/2017.
 */

const config = require('config');


function validate(sessionName, configName, envName, type) {
  let session = config[sessionName];
  if (!session) {
    console.error(`Cannot find config session "${sessionName}"`);
    if (envName) {
      console.error(`You can define a environment variable "${envName}" for this config.`)
    }
    return false;
  }

  let c = session[configName];
  if (!c) {
    console.error(`Cannot find config item "${sessionName}.${configName}".`)
    if (envName) {
      console.error(`You can define a environment variable "${envName}" for this config.`)
    }
    return false;
  }

  let t = typeof c;
  if (typeof type === 'string' && t !== type) {
    console.error(`Type of config item "${sessionName}.${configName}" is not correct, expect "${type}", but it is "${typeof c}"`);
    if (envName) {
      console.error(`If you defined environment variable "${envName}", please check its type.`)
    }
    return false;
  } else if (typeof type === 'function') {
    let r;
    try {
      r = type(c);
    } catch (e) {
      r = e;
    }

    if (r) {
      console.error(`Type of config item "${sessionName}.${configName}" is not correct, ${r}`);
      if (envName) {
        console.error(`If you defined environment variable "${envName}", please check its type.`)
      }
      return false;
    }
  }
  return true;
}

let r = validate('server', 'path', 'SERVER_PATH',
                 c=>(!c.startsWith('/')) && 'it should starts with "/".' );
r = validate('server', 'interval', 'CHECK_INTERVAL', 'number') && r;
r = validate('database', 'host', 'DB_HOST', 'string') && r;
r = validate('database', 'database', 'DB_DATABASE', 'string') && r;
r = validate('database', 'username', 'DB_USERNAME', 'string') && r;
r = validate('database', 'password', 'DB_PASSWORD', 'string') && r;
if (!r) {
  //throw Error('Validate config failed.');
  process.exit(-1);
}