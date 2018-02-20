module.exports = {
  run: (message, userId, commandContent) => {
    if (commandContent) {
      const to = commandContent.substr(0, commandString.indexOf(' ')).toLowerCase();
      const text = commandContent.substr(commandString.indexOf(' ') + 1);
      message.channel.send(`Message to ${to} reads ${text}.`);
    } else {
      message.channel.send('Message for you sir!');
    }

  }
};