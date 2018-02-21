const { getTitle } = require('../utils');

module.exports = {
  run: (message, user) => {
    const title = getTitle(true, user);
    if (title) {
      message.channel.send(title);
    }
  }
};