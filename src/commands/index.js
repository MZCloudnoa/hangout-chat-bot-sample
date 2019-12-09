const { parseArgsStringToArgv } = require('string-argv');
const auth = require('@/lib/auth');
const debug = require('debug')('commands');

const rootCommand = {
  command: '',
  subCommands: [
    require('./service'),
  ],
};

function preprocessCommand(command, prefix) {
  command.fullCommand = prefix ? `${prefix} ${command.command}` : command.command;

  if (command.subCommands) {
    command.subCommands.forEach(subCommand => {
      preprocessCommand(subCommand, command.fullCommand)
    });
  }
}

preprocessCommand(rootCommand);

function parseCommand(command, argv) {
  if (argv[0] === 'help' && argv.length > 0) {
    return { command, usage: true };
  }

  if (command.subCommands && argv.length > 0) {
    const subCommand = command.subCommands.find(c => c.command === argv[0]);
    if (subCommand) {
      return parseCommand(subCommand, argv.slice(1));
    }
  }

  if (command.action) {
    return { command };
  }

  return { command, notExist: true };
}

function printUsage(command) {
  return 'usage : ...';
}

async function execute(userId, notificationId, argumentText) {
  debug('execute', argumentText);

  const res = parseCommand(rootCommand, parseArgsStringToArgv(argumentText));
  if (res.notExist === true) {
    return argumentText + ': 존재하지 않는 명령어입니다.\n' + printUsage(res.command);
  }

  if (res.help === true) {
    // print usage
    return printUsage(res.command);
  }

  const command = res.command;
  debug('command', command);


  if (command.permissions && command.permissions.every(p => !auth.hasPermission(userId, p))) {
    return command.command + ': 명령어를 실행할 권한이 없습니다.';
  }

  return await command.action();
}


module.exports = {
  execute,
};
