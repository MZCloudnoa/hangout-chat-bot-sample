const pubsub = require('@/lib/pubsub');
const config = require('@/config');
const debug = require('debug')('lib:service-manager');

// 서비스 관리 툴 시뮬레이터
// 서비스 환경에서는 외부의 REST/gRPC 등의 API 를 호출하도록 해야함.
// notify 부분을 각 서비스에서 구현하도록 해야함.

const STATUS_STOPPED = 'stopped';
const STATUS_STARTING = 'starting';
const STATUS_RUNNING = 'running';
const STATUS_STOPPING = 'stopping';


// notificationId를 이용해 메시지를 보낸다
// 서비스 -> pubsub -> bot-server -> 사용자
function notify(notificationId, message) {
  return pubsub.publish(
    config.notification.pubsub.projectId,
    config.notification.pubsub.topic,
    {
      notificationId,
      message,
    },
  );
}

// 아래와 같은 서비스들이 있다고 가정함
const services = [
  {
    name: 'game01',
    status: STATUS_RUNNING,
  },
  {
    name: 'game02',
    status: STATUS_RUNNING,
  },
];

function start(name, notificationId) {
  debug('start:', name);

  if (services[name]) {
    return 'service not exist: ' + name;
  }

  if (services[name].status != STATUS_STOPPED) {
    return 'invalid current status: ' + services[name].status;
  }

  setTimeout(() => {
    services[name].status = STATUS_STARTING;

    debug('start status:', name, STATUS_STARTING);
    notify(notificationId, `${name}: service starting...`);
  }, 300);

  setTimeout(() => {
    services[name].status = STATUS_RUNNING;

    debug('start status:', name, STATUS_RUNNING);
    notify(notificationId, `${name}: service started`);
  }, 5000);

  return true;
}

function stop(name, notificationId) {
  debug('stop:', name);

  if (services[name]) {
    return 'service not exist: ' + name;
  }

  if (services[name].status != STATUS_STARTING
    && services[name].status != STATUS_RUNNING) {
    return 'invalid current status: ' + services[name].status;
  }

  setTimeout(() => {
    services[name].status = STATUS_STOPPING;

    debug('start status:', name, STATUS_STOPPING);
    notify(notificationId, `${name}: service stopping...`);
  }, 300);

  setTimeout(() => {
    services[name].status = STATUS_STOPPED;

    debug('start status:', name, STATUS_STOPPED);
    notify(notificationId, `${name}: service stopped`);
  }, 3000);

  return true;
}

function getStatus(name, notificationId) {
  debug('getStatus:', name);

  if (services[name]) {
    return 'service not exist: ' + name;
  }

  setTimeout(() => {
    notify(notificationId, `${name}: ${services[name].status}`);
  }, 300);

  return true;
}

async function getStatusAll(name, notificationId) {
  debug('getStatusAll:', name);

  setTimeout(() => {
    services.forEach(service => {
      notify(notificationId, `${service.name}: ${services.status}`);
    });
  }, 300);

  return true;
}

async function getList(notificationId) {
  debug('getList:');

  setTimeout(() => {
    notify(notificationId, `service list: ${services.map(s => s.name).join(', ')}`);
  }, 300);

  return true;
}

module.exports = {
  start,
  stop,
  getStatus,
  getStatusAll,
  getList,
};
