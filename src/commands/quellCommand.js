const uprisingService = require('../services/uprisingService');

module.exports = {
  run: (message) => {
    uprisingService.quellUprising();
    if (uprisingService.uprisingActive) {
      uprisingService.sendUprisingEnds(message, 'You have beaten back the rebellious serfs to place the Royals back in their rightful place as the rulers of Colere.');
    } else {
      uprisingService.sendUprisingUpdate(message, 'Long hours of bloody fighting have quieted the rebels, but they are not yet done fighting.');
    }
  },
};
