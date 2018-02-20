const { getTitle } = require('../utils');

module.exports = {
  run: (message, userId) => {
    const title = getTitle(true, userId);
    if (title) {
      message.channel.send(title);
    }
  }
};