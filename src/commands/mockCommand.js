const { getRandomFromArray } = require('../utils');
const mockBackChance = .2;

module.exports = {
  run: (message, client, lastMessage, user) => {
    const spongeMock = client.emojis.find('name', 'SpongebobMock');
    if (Math.random() < mockBackChance) {
      if (user.mocks) {
        return message.channel.send(getRandomFromArray(user.mocks));
      }
    }
    if (!lastMessage) {
      return message.channel.send(`duurrr ${spongeMock}`);
    }
    let mockString = '';
    let j = 0;
    for (var i = 0; i < lastMessage.length; i++) {
      const char = lastMessage.charAt(i);
      if (char === ' ') {
        j = 1;
      }
      if (j % 2 === 0) {
        mockString += char.toLowerCase();
      } else {
        mockString += char.toUpperCase();
      }
      j++;
    }
    mockString += ` ${spongeMock}`;
    message.channel.send(mockString);
  }
};