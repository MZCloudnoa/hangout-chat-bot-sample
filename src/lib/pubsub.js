const { PubSub } = require('@google-cloud/pubsub');
const utils = require('@/lib/utils');
const debug = require('debug')('lib:pubsub');

// pubsub을 초기화하고 메시지를 받을 수 있도록 구독한다.
async function initialize(options, callback) {
  utils.checkParameters([
    ['options', options],
    ['callback', utils.isFunction(callback)],
  ]);

  utils.checkParameters([
    ['options.projectId', options.projectId],
    ['options.topic', options.topic],
    ['options.subscription', options.subscription],
  ]);

  // 여기서는 default credential 을 이용해 pubsub api를 호출합니다.
  // 서비스 환경에서는 GOOGLE_APPLICATION_CREDENTIALS 환경변수를 이용해서
  // credential.json 파일의 위치를 지정할 수 있습니다.

  const pubsub = new PubSub({ projectId: options.projectId });

  // topic이 존재하는지 확인하고, 없으면 새로 생성한다.
  const topic = pubsub.topic(options.topic);
  const [topicExists] = await topic.exists();
  if (!topicExists) {
    debug('create topic:', options.topic);
    await topic.create();
  }

  // subscription이 존재하는지 확인하고, 없으면 새로 생성한다.
  const subscription = topic.subscription(options.subscription);
  const [subscriptionExists] = await subscription.exists();
  if (!subscriptionExists) {
    debug('create subscription:', options.subscription);
    await subscription.create();
  }

  // 메시지 구독
  debug('subscribe:', options.subscription);

  const autoAck = options.autoAck !== false;
  const ackOnSuccess = options.ackOnSuccess !== false;

  subscription.on('message', async message => {
    const msgid = Math.floor(Math.random() * 1000000);
    const messageDataText = message.data.toString('utf8');
    debug(`message(${msgid}):`, messageDataText);

    const messageData = JSON.parse(messageDataText);
    let success;

    if (utils.isAsync(callback)) {
      success = await callback(messageData, message);
    } else {
      success = callback(messageData, message);
    }

    if (autoAck && (!ackOnSuccess || success)) {
      message.ack();
      debug(`message(${msgid}) ack`);
    }
  });
}

function publish(project, topic, message) {
  debug('publish:', project, topic, JSON.stringify(message));

  const pubsub = new PubSub({ projectId: project });
  return pubsub.topic(topic).publishJSON(message);
}

module.exports = {
  initialize,
  publish,
};
