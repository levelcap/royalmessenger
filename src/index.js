require('dotenv').config();
const express = require('express');
const app = express();
const Discord = require('discord.js');
const { each, get } = require('lodash');
const bodyParser = require('body-parser');
const mongoServices = require('./services/mongoServices');
const questCommand = require('./commands/questCommand');
const killCommand = require('./commands/killCommand');
const messagesCommand = require('./commands/messagesCommand');
const oocnounceCommand = require('./commands/oocnounceCommand');
const announceCommand = require('./commands/announceCommand');
const statusCommand = require('./commands/statusCommand');
const helpCommand = require('./commands/helpCommand');
const quellCommand = require('./commands/quellCommand');
const mockCommand = require('./commands/mockCommand');
const treasuryCommand = require('./commands/treasuryCommand');
const sayCommand = require('./commands/sayCommand');
const dungeonCommand = require('./commands/dungeonCommand');

const uprisingService = require('./services/uprisingService');
const questService = require('./services/questServices');
const spookyService = require('./services/spookyService');
let lastMessages = new Map();
let sentSpook = false;

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
  const content = message.content;
  const commandPieces = content.split(' ');
  const commandString = content.substr(content.indexOf(' ') + 1);
  let command = '';
  let commandContent = '';

  if (commandPieces.length <= 1) {
    console.log('Blank command, nothing to do.');
    return;
  }

  if (commandPieces.length > 2) {
    command = commandString.substr(0, commandString.indexOf(' ')).toLowerCase();
    commandContent = commandString.substr(commandString.indexOf(' ') + 1);
  } else {
    command = commandString.toLowerCase();
  }

  if (content.includes('/na')) {
    if (command === 'roll') {
      d20 = Math.floor(Math.random() * Math.floor(19)) + 1;
      message.channel.send(`**${user.name}**, rolls a **${d20}**.`);
    } else if (command === 'weather') {
      message.channel.send(`Tamara Frey of WNAR says today will be chilly and overcast with a chance of rain.`);
    }
  }

  if (content.includes('/rm')) {
    return;
    if (command === 'messages' || command === 'message') {
      messagesCommand.run(message, client, user, commandContent);
    } else if (command === 'status') {
      statusCommand.run(message, user, commandContent);
    } else if (command === 'quest') {
      questCommand.run(message, commandContent);
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
    } else if (command === 'mock') {
      mockCommand.run(message, client, lastMessages.get(message.channel.id), user);
    } else if (command === 'treasury') {
      // treasuryCommand.run(message, commandContent, user);
    } else if (command === 'say') {
      sayCommand.run(message, client, commandContent);
    } else if (command == 'dungeon') {
      dungeonCommand.run(message, client, commandContent);
    }
  } else {
    lastMessages.set(message.channel.id, message.content);
  }
};

const parseMessage = (message) => {
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
      mod: false,
      titles: {
        ic: [ `Hear ye, hear ye, the character belong to ${username} has arrived.` ],
        ooc: [ `Look its ${username}, everyone do the thing where they pretend to care.` ],
      },
      mocks: [ 'aDoOoOoOoOoY!' ],
      wealth: {
        debt: 0,
        gold: 100,
      },
    };
    users.insertOne(newUser, (err, result) => {
      return handleMessage(message, newUser);
    });
  });
};

// Create an event listener for messages
client.on('message', message => {
  parseMessage(message);
});

client.on('messageUpdate', (oldMessage, message) => {
  parseMessage(message);
});

client.on('guildMemberAdd', member => {
  const message = `_Welcome to New Arcadia, ${member}! Have a look around, feel free to just jump into making a character and playing, or let us know if you have any questions._`
  member.guild.channels.get('561202141847355393').send(); 
})

client.on('guildMemberRemove', member => {
  const message = `_${member} has left New Arcadia and will be immediately forgotten forever who are we even talking about?`
  member.guild.channels.get('561202141847355393').send(); 
})

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
  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set('view engine', 'ejs');
  app.set('views', `${__dirname}/views`);

  app.get('/', (req, res) => {
    res.send('<h1>Nothing!</h1>');
  });

  app.get('/quests', (req, res) => {
    questService.questList().then((quests) => {
      const locals = {
        quests,
        random: 'thisThing',
      };
      res.render('questList', locals);
    });
  });

  app.get('/quests/:quest_id', (req, res) => {
    const questId = get(req, 'params.quest_id');
    questService.questList(questId).then((questPages) => {
      const locals = {
        questPages,
      };
      res.render('quest', locals);
    });
  });

  app.get('/quests/:quest_id/edit', (req, res) => {
    const questId = get(req, 'params.quest_id');
    questService.questPage(questId).then((questPage) => {
      const locals = {
        questPage,
      };

      res.render('questEdit', locals);
    });
  });

  app.get('/quests/:quest_number/new', (req, res) => {
    const questNumber = get(req, 'params.quest_number');
    const locals = {
      questNumber,
    };

    res.render('questForm', locals);
  });

  app.post('/quests', (req, res) => {
    const questId = get(req, 'params.quest_id');
    const formBody = get(req, 'body');
    if (formBody.password !== process.env.PASS) {
      console.log('Bad password');
      return res.render('saveFail');
    }
    questService.addQuestPage(req.body).then(() => {
      return res.render('saveSuccess');
    }).catch(() => {
      return res.render('saveFail');
    });
  });

  app.put('/quests/:quest_id', (req, res) => {
    const questId = get(req, 'params.quest_id');
    console.log(req.body);
    // questService.editQuestPage(questId, req.body);
    res.render('saveSuccess');
  });


  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`RoyalMessengers listening on ${port}`));

  // setInterval(() => {
  //   let selectedChannel;
  //   each(client.channels.array(), (channel) => {
  //     if (channel.name === 'bot-commands') {
  //       selectedChannel = channel;
  //     }
  //   });
  //   uprisingService.uprisingActivity(selectedChannel);
  // }, 60000*5);

  // setInterval(() => {
  //   client.fetchUser('342295710596726785').then((user) => {
  //     if (user.presence.status === 'online') {
  //       user.send(spookyService.getSpookyMessage());
  //     }
  //   })
  // }, 60000*30);
});