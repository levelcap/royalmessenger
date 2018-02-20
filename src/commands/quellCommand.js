const uprisingService = require('../services/uprisingService');

module.exports = {
  run: (message) => {
    uprisingService.quellUprising();
    message.channel.send('Well that was easy, uprising quelled.');
  },
};
