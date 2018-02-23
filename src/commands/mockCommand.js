module.exports = {
  run: (message, client, lastMessage) => {
    let mockString = '';
    let j = 1;
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
    const spongeMock = client.emojis.find('name', 'SpongebobMock');
    mockString += ` ${spongeMock}`;
    message.channel.send(mockString);
  }
};