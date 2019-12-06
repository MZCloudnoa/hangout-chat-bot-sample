module.exports = {
  command: 'start',

  description: '서비스를 시작합니다.',

  permissions: ['service.start'],

  arguments: [{
    name: 'service-name',
    description: '시작할 서비스의 이름',
    type: String,
    required: true,
  }],

  async action() {
  },
};
