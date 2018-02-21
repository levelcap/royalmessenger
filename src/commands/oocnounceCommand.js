const { getTitle } = require('../utils');

module.exports = {
  run: (message, userId) => {
    const title = getTitle(true, user._id);
    if (title) {
      message.channel.send(title);
    }
  }
};