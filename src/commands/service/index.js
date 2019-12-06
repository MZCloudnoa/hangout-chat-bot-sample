module.exports = {
  command: 'service',

  description: '서비스 관리를 위한 명령어 그룹입니다.',

  subCommands: [
    require('./list'),
    require('./status'),
    require('./start'),
    require('./stop'),
  ],
};
