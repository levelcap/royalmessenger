const Discord = require('discord.js');
const { getRandomFromArray } = require('../utils');

const starts = [
  'Hear ye, hear ye, a message most Royal',
  'Extra! Extra! Read all about it! Or I guess I do that for you, right',
  'Message for you sir!',
];

const preps = [
  'The Royal Messenger unfurls a long scroll, clears his throat and reads',
  'The Royal Messenger clears his throat loudly, spits to the side, and recites from memory',
  'The Royal Messenger instinctively covers his vitals before reading from a dirty note'
];

const images = [
  '/images/the-end.jpg',
];

module.exports = {
  run: (message, client, user, commandContent) => {
    if (commandContent) {
      const text = commandContent.substr(commandContent.indexOf(' ') + 1);
      if (message.mentions.users && message.mentions.users.first()) {
        const firstUser = message.mentions.users.first();
        client.fetchUser(firstUser.id).then((toUser) => {
          const messageStart = getRandomFromArray(starts);
          const messagePrep = getRandomFromArray(preps);
          const fullMessage =
            `"${messageStart} from ${user.name}!"` +
            `${messagePrep}: "${text}"`;

          const embed = new Discord.RichEmbed({
            color: 15654822,
            title: 'A messenger arrives!',
            description: fullMessage,
          });
          const image = getRandomFromArray(images);
          embed.setImage(`${process.env.BASE_URL}${image}`);

          toUser.send(embed);
          message.channel.send('Your message will be delivered post-haste!');
        }).catch((err) => {
          console.log(err);
        });
      }
    } else {
      message.channel.send('Message for you sir! :scroll:');
    }
  }
};