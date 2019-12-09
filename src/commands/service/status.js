module.exports = {
  command: 'status',

  description: '서비스의 상태를 조회합니다.',

  permissions: ['service.status'],

  aliases: ['stat'],

  options: [{
    name: 'all',
    aliases: ['a'],
    description: '모든 서비스의 상태를 조회합니다. (서비스 이름 생략)',
    type: Boolean,
    default: false,
  }],

  arguments: [{
    name: 'service-name',
    description: '조회할 서비스의 이름',
    type: String,
    required: false,
  }],

  async action() {
  },
};
