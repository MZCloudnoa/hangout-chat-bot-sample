const _ = require('lodash');
const { google } = require('googleapis');
const fs = require('fs');
const pubsub = require('@/lib/pubsub');
const utils = require('@/lib/utils');
const config = require('@/config');
const debug = require('debug')('lib:hangout');

function toString(obj) {
  switch (obj.type) {
    case 'DM':
    case 'ROOM': return `space(${obj.displayName || ''},${obj.name})`;
    case 'HUMAN': return `user(${obj.displayName},${obj.email})`;
    case 'MESSAGE': return `message(${obj.space.type},${obj.message.thread.name},${obj.message.argumentText.trim()})`;
    default: return JSON.stringify(obj);
  }
}

async function callHandler(callbacks, name, ...args) {
  if (callbacks[name] && utils.isFunction(callbacks[name])) {
    if (utils.isAsync(callbacks[name])) {
      return callbacks[name](...args);
    } else {
      return callbacks[name](...args);
    }
  }

  return true;
}

async function handlePubsub(data, callbacks) {
  switch (data.type) {
    // 대화방에 초대되거나 삭제되면 호출된다. 참고용이므로 로그만 남기고 아무 일도 할 필요가 없다.
    // 사용자와 1:1 대화가 시작 또는 종료될 경우에는 data.space.displayName 가 존재하지 않는다.
    case 'ADDED_TO_SPACE':
      debug('handlePubsub:', data.type, toString(data.space), toString(data.user));
      return await callHandler(callbacks, 'handleAddToSpace', data);

    case 'REMOVED_FROM_SPACE':
      debug('handlePubsub:', data.type, toString(data.space), toString(data.user));
      return await callHandler(callbacks, 'handleRemoveFromSpace', data);

    // 사용자로부터 메시지를 받은 경우에 호출된다.
    // DM 으로 오는 경우나 SPACE 에서 mention 으로 받는 경우 모두 같은 타입으로 오며,
    // data.message,space.type (DM|ROOM) 으로 구분 가능하다.
    case 'MESSAGE':
      debug('handlePubsub:', data.type, toString(data.space), toString(data.user), toString(data));
      return await callHandler(callbacks, 'handleMessage', data);

    default:
      debug('handlePubsub: UNKNOWN', JSON.stringify(data));
      return true;
  }
}

const SCOPE_CHAT_BOT = 'https://www.googleapis.com/auth/chat.bot';

// hangout chat을 초기화하고 메시지를 받을 수 있도록 구독한다.
async function initialize(callbacks) {
  debug('initialize');

  const options = _.merge({
    autoAck: true,
    ackOnSuccess: true,
  }, config.hangout.pubsub);
  debug('options', JSON.stringify(options));

  await pubsub.initialize(options, async data => {
    return await handlePubsub(data, callbacks);
  });
}

async function sendMessage(space, thread, message) {
  debug('sendMessage', space, thread, message);

  // 여기서는 default credential 을 이용해 hangouts chat api를 호출합니다.
  // 서비스 환경에서는 GOOGLE_APPLICATION_CREDENTIALS 환경변수를 이용해서
  // credential.json 파일의 위치를 지정할 수 있습니다.
  const auth = await google.auth.getClient({ scopes: [SCOPE_CHAT_BOT] });
  const chat = google.chat({ version: 'v1', auth });

  const payload = {
    parent: space,
    requestBody: {
      text: message,
    }
  };

  if (thread) {
    payload.requestBody.thread = { name: thread };
  }

  return chat.spaces.messages.create(payload).catch(err => {
    console.error(err);
  });
}

module.exports = {
  initialize,
  sendMessage,
};
