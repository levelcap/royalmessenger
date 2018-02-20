require('dotenv').config();
const http = require('http');
const Discord = require('discord.js');
const questCommand = require('./commands/questCommand');
const killCommand = require('./commands/killCommand');
const messagesCommand = require('./commands/messagesCommand');
const oocnounceCommand = require('./commands/oocnounceCommand');
const announceCommand = require('./commands/announceCommand');
const statusCommand = require('./commands/statusCommand');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.DISCORD_TOKEN;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  const userId = message.author.id;
  const username = message.author.username;
  console.log(`${userId} : ${username}`);
  if (message.content.includes('/rm')) {
    const content = message.content;
    // Send "pong" to the same channel
    const commandPieces = content.split(' ');
    const commandString = content.substr(content.indexOf(' ') + 1);
    let command = '';
    let commandContent = '';

    if (commandPieces.length <= 1) {
      console.log('Nothing to do.');
      return;
    }
    if (commandPieces.length > 2) {
      command = commandString.substr(0, commandString.indexOf(' ')).toLowerCase();
      commandContent = commandString.substr(commandString.indexOf(' ') + 1);
    } else {
      command = commandString;
    }

    if (command === 'messages') {
      messagesCommand.run(message, userId);
    } else if (command === 'status') {
      statusCommand.run(message, userId, commandContent);
    } else if (command === 'quest') {
      questCommand.run(message);
    } else if (command === 'kill') {
      killCommand.run(message, userId, username, commandContent);
    } else if (command === 'oocnounce') {
      oocnounceCommand.run(message, userId);
    } else if (command === 'announce') {
      announceCommand.run(message, userId);
    }
  }
});

// Log our bot in
client.login(token);

http.createServer((req, res) => {
  res.writeHead(200, "OK");
  res.write("<h1>Hello</h1>Node.js is working");
  res.end();
}).listen(process.env.PORT || 3000);