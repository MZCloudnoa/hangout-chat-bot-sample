const serviceManager = require('@/lib/service-manager');

module.exports = {
  command: 'list',

  description: '서비스를 목록을 조회합니다.',

  permissions: ['service.list'],

  aliases: ['l', 'ls'],

  async action(context) {
    return await serviceManager.getList(context.notificationId);
  },
};
