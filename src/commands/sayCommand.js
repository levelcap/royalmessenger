const Discord = require('discord.js');
const { getRandomFromArray } = require('../utils');
const { each } = require('lodash');

module.exports = {
  run: (message, client, commandContent) => {
    if (commandContent) {
      let toChannel;
      const toChannelName = commandContent.split(' ')[0];
      const text = commandContent.substr(commandContent.indexOf(' ') + 1);
      each(client.channels.array(), (channel) => {
        if (channel.name === toChannelName) {
          toChannel = channel;
        }
      });
      if (toChannel) {
        toChannel.send(text);
      } else {
        message.channel.send('I am not familiar with that address.');
      }
    } else {
      message.channel.send('I am not sure what you want me to do.');
    }
  }
};