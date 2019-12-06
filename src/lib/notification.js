const _ = require('lodash');
const pubsub = require('@/lib/pubsub');
const config = require('@/config');
const debug = require('debug')('lib:notification');

// notification을 초기화하고 메시지를 받을 수 있도록 구독한다.
async function initialize(callback) {
  debug('initialize');

  const options = _.merge({
    autoAck: true,
    ackOnSuccess: true,
  }, config.notification.pubsub);
  debug('options', JSON.stringify(options));

  await pubsub.initialize(options, callback);
}

module.exports = {
  initialize,
};
