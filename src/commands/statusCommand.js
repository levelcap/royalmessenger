const { isMod } = require('../utils');
let status = 'Welcome to Eden!';

module.exports = {
  run: (message, userId, commandContent) => {
    if (commandContent) {
      if (isMod(userId)) {
        status = commandContent;
        message.channel.send(`New status is: ${commandContent}`);
      } else {
        message.channel.send('My humblest apologies, you are not allowed to update the realm\'s status.');
      }
    } else {
      message.channel.send(status);
    }
  },
  status,
};
