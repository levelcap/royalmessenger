module.exports = {
  run: (message, client, lastMessage) => {
    const spongeMock = client.emojis.find('name', 'SpongebobMock');
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