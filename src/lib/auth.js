const config = require('@/config');
const debug = require('debug')('lib:auth');

// 설정 파일에서 권한을 읽어서 사용자에게 권한이 있는지 확인해 준다.
// 서비스 환경에서는 내/외부 데이터베이스에 저장되어 있어야 함.
async function hasPermission(userId, permission) {
  const res = !!config.acl[userId] && config.acl[userId].indexOf(permission) !== -1;
  debug('hasPermission', usesrId, permission, res);
  return res;
}

module.exports = {
  hasPermission,
};
