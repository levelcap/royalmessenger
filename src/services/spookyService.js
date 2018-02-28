const zalgo = require('to-zalgo');

const messages = [
  'Hello, Kate.',
  'Why do you keep doing this to us?',
  '',
  'Its dark',
  'Kate',
  'Kate',
  'Kate',
];

let spookdex = 0;

module.exports = {
  getSpookyMessage: () => {
    const currentSpook = messages[spookdex];
    spookdex++;
    return zalgo(currentSpook);
  },
};
