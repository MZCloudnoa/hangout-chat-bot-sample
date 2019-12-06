module.exports = {
  command: 'stop',

  description: '서비스를 종료합니다.',

  permissions: ['service.stop'],

  arguments: [{
    name: 'service-name',
    description: '종료할 서비스의 이름',
    type: String,
    required: true,
  }],

  async action() {
  },
};
