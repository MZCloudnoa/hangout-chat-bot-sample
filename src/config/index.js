const fs = require('fs');
const path = require('path');
const flat = require('flat');
const _ = require('lodash');

function load(names) {
  return _.merge({}, ...names.map(name => {
    const configPath = path.join(__dirname, name + '.js');
    return fs.existsSync(configPath) ? flat.unflatten(require(configPath)) : {};
  }));
}

// 아래의 순서로 설정 파일을 로드하여 앞의 설정을 덮어쓴다.
module.exports = load([
  'default',
  process.NODE_ENV || 'development',
  'local',
]);
