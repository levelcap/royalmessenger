const treasuryService = require('../services/treasuryService');

module.exports = {
  run: (message, commandContent, user) => {
    if (!commandContent) {
      treasuryService.getWealth(message, user);
    } else {
      const [ method, value ] = commandContent.split(' ');
      if (method === 'borrow') {
        if (parseInt(value, 10)) {
          treasuryService.borrow(message, user, parseInt(value, 10));
        } else {
          message.channel.send('Trying borrowing a number, dummy.');
        }
      } else if (method === 'repay') {
        if (parseInt(value, 10)) {
          treasuryService.repay(message, user, parseInt(value, 10));
        } else {
          message.channel.send(`I am afraid that the treasury does not accept repayment in the form of ${value}`);
        }
      }
    }
  }
};