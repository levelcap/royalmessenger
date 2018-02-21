require('dotenv').config();
const http = require('http');
const Discord = require('discord.js');
const mongoServices = require('./services/mongoServices');
const questCommand = require('./commands/questCommand');
const killCommand = require('./commands/killCommand');
const messagesCommand = require('./commands/messagesCommand');
const oocnounceCommand = require('./commands/oocnounceCommand');
const announceCommand = require('./commands/announceCommand');
const statusCommand = require('./commands/statusCommand');
const helpCommand = require('./commands/helpCommand');
const quellCommand = require('./commands/quellCommand');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.DISCORD_TOKEN;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

const handleMessage = (message, user) => {
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
      command = commandString.toLowerCase();
    }

    if (command === 'messages') {
      messagesCommand.run(message, client, user, commandContent);
    } else if (command === 'status') {
      statusCommand.run(message, user, commandContent);
    } else if (command === 'quest') {
      questCommand.run(message);
    } else if (command === 'kill') {
      killCommand.run(message, user, commandContent);
    } else if (command === 'oocnounce') {
      oocnounceCommand.run(message, user);
    } else if (command === 'announce') {
      announceCommand.run(message, user);
    } else if (command === 'help' || command === '?') {
      helpCommand.run(message);
    } else if (command === 'quell') {
      quellCommand.run(message);
    }
  }
};

// Create an event listener for messages
client.on('message', message => {
  if (message.author.bot) return;

  const db = mongoServices.getDb();
  const users = db.collection('users');

  // If the message is "ping"
  const userId = message.author.id;
  const username = message.author.username;
  if (process.env.LOG_NAMES === 'true') {
    console.log(`${userId} : ${username}`);
  }

  users.findOne({ _id: userId }, (err, foundUser) => {
    if (foundUser) {
      return handleMessage(message, foundUser);
    }
    const newUser = {
      _id: userId,
      name: username,
    };
    users.insertOne(newUser, (err, result) => {
      return handleMessage(message, newUser);
    });
  });
});

// Connection URL
const url = process.env.MONGODB_URI;

// Use connect method to connect to the server
mongoServices.connectDb((err) => {
  if (err) {
    console.log('Error connecting to Mongo, exiting');
    console.log(err);
    return;
  }
  console.log("Connected successfully to MongoDB, logging into Discord");

  // Log our bot in
  client.login(token);

  http.createServer((req, res) => {
    res.writeHead(200, "OK");
    res.write("<h1>This is nothing</h1>");
    res.end();
  }).listen(process.env.PORT || 3000);
});