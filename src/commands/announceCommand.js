const { getTitle } = require('../utils');

module.exports = {
  run: (message, user) => {
    const title = getTitle(false, user._id);
    if (title) {
      message.channel.send(title);
    }
  }
};