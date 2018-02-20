const Discord = require('discord.js');

const helpText =
  "Here are the commands the royal messenger will obey:\n\n" +
  "/rm announce: The Royal Messenger will deliver an IC(ish) announcement.\n" +
  "/rm oocnounce: The Royal Messenger will deliver an OOC announcement.\n" +
  "/rm help or /rm ?: This. You are currently looking at it." +
  "/rm kill: You will brutally murder a Royal Messenger. Wait. What?\n" +
  "/rm kill me: In an act of craven cowardice you will commit suicide by Royal Messenger.\n" +
  "/rm kill {name}: The Royal Messenger will kill your chosen target\n" +
  "/rm messages: The Royal Messenger may eventually give you messages, for now he just says a thing.\n" +
  "/rm quest: The Royal Messenger will give a quest for the brave and bold.\n" +
  "/rm status: The Royal Messenger will tell you the current status of Eden.\n" +
  "/rm status {new status}: Sets a new status for Eden, only works for mods (probably).\n";

const helpEmbed = new Discord.RichEmbed({
  description: helpText,
  color: 51455,
});

module.exports = {
  run: (message) => {
    message.channel.send(helpEmbed);
  }
};