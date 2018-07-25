const zalgo = require('to-zalgo');

const messages = [
  'Hello, Kate.',
  'You have sent so many of us to the grave',
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
  spookyTypingResponse: () => {
    return zalgo('Oh there you are');
  }
};
