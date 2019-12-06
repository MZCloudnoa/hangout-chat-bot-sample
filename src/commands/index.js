const { parseArgsStringToArgv } = require('string-argv');
const auth = require('@/lib/auth');
const debug = require('debug')('commands');

const rootCommand = {
  subCommands: [
    require('./service'),
  ],
};

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

  return { command };
}

function execute(userId, notificationId, argumentText) {
  debug('execute', argumentText);

  const command = parseCommand(rootCommand, parseArgsStringToArgv(argumentText));
  debug('command', command);

  if (command.permissions && command.permissions.every(p => !auth.hasPermission(userId, p))) {
  }

  return 'done';
}


module.exports = {
  execute,
};
