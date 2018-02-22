const uprisingService = require('../services/uprisingService');

module.exports = {
  run: (message) => {
    uprisingService.quellUprising(message);
  },
};
