const zalgo = require('to-zalgo');

const messages = [
  'Hello, Kaden',
  'You have taken so many of us',
  'Too many',
];

let spookdex = 0;

module.exports = {
  getSpookyMessage: () => {
    const currentSpook = messages[spookdex];
    spookdex++;
    return zalgo(currentSpook);
  },
};
