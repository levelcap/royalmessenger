module.exports = {
  run: (message, userId, commandContent) => {
    if (commandContent) {
      const to = commandContent.substr(0, commandContent.indexOf(' ')).toLowerCase();
      const text = commandContent.substr(commandContent.indexOf(' ') + 1);
      console.log(to);
      message.channel.send(`Message to ${to} reads ${text}.`);
    } else {
      message.channel.send('Message for you sir!');
    }

  }
};