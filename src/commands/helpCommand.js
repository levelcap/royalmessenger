const Discord = require('discord.js');

const helpFields = [
  {
    name: '/rm announce',
    value: 'The Royal Messenger will deliver an IC(ish) announcement.',
  },
  {
    name: '/rm oocnounce',
    value: 'The Royal Messenger will deliver an OOC announcement.',
  },
  {
    name: '/rm help or ?',
    value: 'This. You are currently looking at it.',
  },
  {
    name: '/rm kill',
    value: 'You will brutally murder a Royal Messenger. Wait. What?',
  },
  {
    name: '/rm kill me',
    value: 'In an act of craven cowardice you will commit suicide by Royal Messenger.',
  },
  {
    name: '/rm kill {name}',
    value: 'The Royal Messenger will kill your chosen target.',
  },
  {
    name: '/rm messages',
    value: 'The Royal Messenger may eventually give you messages, for now he just says a thing.',
  },
  {
    name: '/rm messages @{user} {message}',
    value: 'The Royal Messengers will deliver a private message to the user.',
  },
  {
    name: '/rm quest',
    value: 'The Royal Messenger will give a quest for the brave and bold.',
  },
  {
    name: '/rm status',
    value: 'The Royal Messenger will tell you the current status of Eden.',
  },
  {
    name: '/rm status {new status}',
    value: 'Sets a new status for Eden, only works for mods (probably).',
  },
  {
    name: '/rm quell',
    value: 'Sometimes there is rebellion, and sometimes that rebellion needs to be quelled.',
  },
];

const helpEmbed = new Discord.RichEmbed({
  title: "Royal Messenger Help",
  description: "The commands the royal messenger will obey!",
  fields: helpFields,
  color: 51455,
});

module.exports = {
  run: (message) => {
    message.channel.send(helpEmbed);
  }
};