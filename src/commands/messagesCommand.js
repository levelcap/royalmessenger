const Discord = require('discord.js');

module.exports = {
  run: (message, client, userId, username, commandContent) => {
    if (commandContent) {
      const text = commandContent.substr(commandContent.indexOf(' ') + 1);
      if (message.mentions.users && message.mentions.users.first()) {
        const firstUser = message.mentions.users.first();
        client.fetchUser(firstUser.id).then((user) => {
          user.send(`"Hear ye, hear ye, a message most Royal from ${username}!" The Royal Messenger unfurls a long scroll, clears his throat and reads: "${text}".`);
        }).catch((err) => {
          console.log(err);
        });
      }
    } else {
      message.channel.send('Message for you sir!');
    }

  }
};