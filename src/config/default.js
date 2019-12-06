module.exports = {
  hangout: {
    pubsub: {
      projectId: process.env.GCP_PROJECT_ID || 'cloudnoa-dev',
      topic: 'sample-bot',
      subscription: 'sample-bot-server',
    },
  },

  notification: {
    pubsub: {
      projectId: process.env.GCP_PROJECT_ID || 'cloudnoa-dev',
      topic: 'sample-bot-notification',
      subscription: 'sample-bot-notification-server',
    },
  },

  acl: {
    'inkyupark@mz.co.kr': [
      'service.list',
      'service.status',
      'service.start',
      'service.stop',
    ],
  },
};
