/**
 * Created by colinhan on 15/11/2016.
 */

const _ = require('lodash');
const Sequelize = require('sequelize');

let _relationships = {};
let _defaultOptions = {
  hasOne: {onUpdate: 'cascade', onDelete: 'cascade'},
  hasMany: {onUpdate: 'cascade', onDelete: 'cascade'},
};

function _applyToImpl(funcName, {src, target, options}) {
  let func = Sequelize.Model.prototype[funcName];
  if (typeof func !== 'function') {
    throw new Error(`Function '${funcName}' is not found.`);
  }

  if (typeof(src) === 'string') {
    src = this[src];
  }

  if (typeof(target) === 'string') {
    target = this[target];
  }

  if (!(src instanceof Sequelize.Model) ||
          !(target instanceof Sequelize.Model))
  {
    console.log(src, target);
    throw new Error('Relationship should be define between Sequelize.Model.')
  }

  func.call(src, target, options);
}
function _appendImpl(funcName, src, target, options) {
  let defaultOptions = _defaultOptions[funcName];
  let relationship = _relationships[funcName];
  if (!relationship) {
    _relationships[funcName] = relationship = [];
  }
  relationship.push({
    src,
    target,
    options: _.assign({}, defaultOptions, options)
  });
}

module.exports = {
  hasMany: _appendImpl.bind(null, 'hasMany'),
  hasOne: _appendImpl.bind(null, 'hasOne'),
  belongsTo: _appendImpl.bind(null, 'belongsTo'),
  applyTo(models) {
    ['hasOne', 'hasMany', 'belongsTo'].forEach(function (funcName) {
      let relationship = _relationships[funcName];
      if (relationship) {
        relationship.forEach(_applyToImpl.bind(models, funcName));
      }
    });
  }
};