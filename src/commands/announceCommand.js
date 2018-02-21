const { getTitle } = require('../utils');

module.exports = {
  run: (message, user) => {
    const title = getTitle(false, user);
    if (title) {
      message.channel.send(title);
    }
  }
};