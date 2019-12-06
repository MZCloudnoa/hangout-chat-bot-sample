const fs = require('fs');
const path = require('path');

function watchFile(filename, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = {};
  } else {
    options = options || {};
  }

  const pathToWatch = path.resolve(process.cwd(), filename);

  if (!fs.existsSync(pathToWatch)) {
    return;
  }

  fs.watch(pathToWatch, (eventType, filename) => {
    if (options.oneTime) {
      fs.unwatchFile(pathToWatch);
    }

    cb(eventType, filename);
  });
}

function unwatchFile(filename) {
  const pathToWatch = path.resolve(process.cwd(), filename);

  fs.unwatchFile(pathToWatch);
}

// 리소스 경로에서 맨 마지막 이름 부분을 가져온다
// ex> 'projects/cloudnoa-dev/subscriptions/sample-bot-server' => 'sample-bot-server'
function getResourceName(rc) {
  return rc.name.split('/').pop();
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function isAsync(fn) {
  return fn.constructor.name === 'AsyncFunction';
}

function checkParameter(name, param, message) {
  if (!param) {
    throw new Error(`${message || 'invalid parametes'}: ${name}`);
  }
}

function checkParameters(params) {
  params.forEach(p => checkParameter(...p));
}

function exitOnFileChange(files) {
  files = files ? (Array.isArray(files) ? files : [files]) : [];

  files.forEach(file => {
    watchFile(file, () => {
      console.log(`exit process on ${file} change`);
      process.exit();
    });
  })
}

function exitOnSignal(signals) {
  signals = signals ? (Array.isArray(signals) ? signals : [signals]) : [];

  signals.forEach(sig => {
    process.on(sig, () => {
      console.log('exit process on signal: ', sig);
      process.exit();
    });
  });
}

// 종료 시그널이 오면 서버를 종료한다.

module.exports = {
  watchFile,
  unwatchFile,
  exitOnFileChange,
  exitOnSignal,
  getResourceName,
  isFunction,
  isAsync,
  checkParameter,
  checkParameters,
};
