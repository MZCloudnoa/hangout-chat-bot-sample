require('module-alias/register'); // require로 모듈 로드시 '@'를 'src'의 경로로 대치한다.
require('dotenv').config(); // .env 파일에서 환경 변수를 로드한다.

const config = require('@/config');
const utils = require('@/lib/utils');
const hangout = require('@/lib/hangout');
const notification = require('@/lib/notification');
const commands = require('@/commands');

const debug = require('debug')('main');

async function main() {
  if (config.exitOnEnvChange) {
    // PM2는 .env 파일 변경을 추적하지 못하므로 해당 파일 변경시 서버를 종료해서 재시작 하도록 한다. (개발시에만 사용할것)
    utils.exitOnFileChange('.env');
  }

  // 종료 시그널이 오면 서버를 종료한다.
  utils.exitOnSignal(['SIGINT', 'SIGTERM']);

  // notification 메시지를 받을 수 있도록 설정한다.
  await notification.initialize(handleNotificationMessage);

  // 행아웃 메시지를 주고 받을 수 있도록 설정한다.
  await hangout.initialize({
    handleMessage: handleHangoutMessage,
  });
}

async function handleHangoutMessage(data) {
  debug('handleHangoutMessage', data.message.argumentText);

  // 형식: 'spaces/[룸ID]/threads/[쓰레드ID]'
  // DM의 경우에도 위와 동일한 형태이며, 룸ID 가 '-'로 시작함
  const notificationId = data.message.thread.name;

  const output = await commands.execute(
    data.message.sender.email,
    notificationId,
    data.message.argumentText,
  );

  if (output !== true) {
    // 직접 받은 메시지(에러 등)는 바로 사용자에게 보내준다.
    hangout.sendMessage(notificationId, output);
  }

  return true;
}

async function handleNotificationMessage(data) {
  debug('handleNotificationMessage', data);

  return true;
}


main();
