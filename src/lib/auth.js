const config = require('@/config');
const debug = require('debug')('lib:auth');

async function hasPermission(userId, permission) {
  const res = !!config.acl[userId] && config.acl[userId].indexOf(permission) !== -1;
  debug('hasPermission', usesrId, permission, res);
  return res;
}

module.exports = {
  hasPermission,
};
