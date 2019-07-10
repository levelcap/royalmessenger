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

const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN;

// Channels
const ROLEPLAY_CHANNEL = '561259155365560360'
const TINY_SHOES_CHANNEL = '562119245425672222'
const OOC_CHANNEL = '561202141847355393'
const MULTI_LINE_CHANNEL = '563714797481492502'

// Categories
const IC_CATEGORY = '561259088915202080'

// Roles
const ADMIN_ROLE = '561206997043773440'
const CHARACTER_ROLE = '562284436343750667'

// Emotes
const MERCER_SHOE = '562116703312674817'

//collections
USERS = 'na_users'

client.on('ready', () => {
  console.log('I am ready!');
});

const canChangeICChannels = (category, roles) => {
  if (category === IC_CATEGORY && (roles.includes(ADMIN_ROLE) || roles.includes(CHARACTER_ROLE))) {
    return true;
  }
  return false;
};

const unclaimedChannelName = (channel) => {
  return `unclaimed-rp-${channel.position}`;
};

const unclaimedChannels = (channel) => {
  return client.channels.get(IC_CATEGORY).children.some((child) => {
    return child.includes('unclaimed-rp')
  });
};

const createNewICChannel = (guild) => {
  console.log('Not implemented');
  // let position = 0;
  // client.channels.get(IC_CATEGORY).children.forEach((child) => {
  //   if (child.position >= position) {
  //     position = child.position + 1;
  //   }
  // });
  // guild.createChannel(`unclaimed-rp-${position}`, 'text').then((channel) => {
  //   channel.setParent(IC_CATEGORY).then(console.log).catch(console.error);
  // }).catch(console.error);
  return;
};

const handleMessage = (message, user, update = false) => {
  // Increment IC messages count
  if (message.channel.id === ROLEPLAY_CHANNEL && !update) {
    const userCollection = mongoServices.getDb().collection(USERS);
    userCollection.findOneAndUpdate({ _id: user._id }, { $inc: { 'posts': 1 } }, () => {});
  }
  const content = message.content;
  const commandPieces = content.split(' ');
  const commandString = content.substr(content.indexOf(' ') + 1);
  let command = '';
  let commandContent = '';

  if (commandPieces.length <= 1) {
    return;
  }

  if (commandPieces.length > 2) {
    command = commandString.substr(0, commandString.indexOf(' ')).toLowerCase();
    commandContent = commandString.substr(commandString.indexOf(' ') + 1);
  } else {
    command = commandString.toLowerCase();
  }

  if (content.includes('/na')) {
    channel = message.channel;
    category = channel.parent.id;
    sibling_channels = channel.parent.children;
    roles = message.member.roles.keyArray();

    if (command === 'roll') {
      d20 = Math.floor(Math.random() * Math.floor(19)) + 1;
      message.channel.send(`**${message.author}**, rolls a **${d20}**.`);
    } else if (command === 'weather') {
      message.channel.send(`Tamara Frey of WNAR says today will be chilly and overcast with a chance of rain.`);
    } else if (command === 'claim') {
      if (canChangeICChannels(category, roles)) {
        newName = commandContent.replace(/\W/g, ' ').replace(/\s+/g, '-').toLowerCase();
        channel.setName(newName).then(newChannel => channel.send(`You are now roleplaying in ${newChannel.name}`)).catch(console.error);
        message.delete().then().catch((err)=> { console.log(err)});
      } else {
        channel.send(`Sorry, you aren't allowed to do that. I guess the admins just don't trust you.`);
        message.delete().then().catch((err)=> { console.log(err)});
      }
    } else if (command === 'unclaim') {
      if (canChangeICChannels(category, roles)) {
        newName = unclaimedChannelName(channel)
        channel.setName(newName).then(newChannel => channel.send(`You have unclaimed this channel and it is now called ${newChannel.name}`)).catch(console.error);
        message.delete().then().catch((err)=> { console.log(err)});
      } else {
        channel.send(`Sorry, you aren't allowed to do that. I guess the admins just don't trust you.`);
        message.delete().then().catch((err)=> { console.log(err)});
      }
    } else if (command == 'more') {
      if (unclaimedChannels()) {
        channel.send(`There are still unclaimed RP channels, go claim one of those you greedy bastard.`);
        message.delete().then().catch((err)=> { console.log(err)});
      } else if (canChangeICChannels(category, roles)) {
        createNewICChannel();
        channel.send(`Not yet. Sooooon.`);
        message.delete().then().catch((err)=> { console.log(err)});
      } else {
        channel.send(`Sorry, you aren't allowed to do that. I guess the admins just don't trust you.`);
        message.delete().then().catch((err)=> { console.log(err)});
      }
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

const parseMessage = (message, update = false) => {
  if (message.author.bot) return;

  if (message.channel.id === TINY_SHOES_CHANNEL) {
    message.react(message.guild.emojis.get(MERCER_SHOE)).then(console.log).catch(console.error);
    return;
  }

  if (message.channel.id === MULTI_LINE_CHANNEL) {
    if (message.content.length < 200) {
      sendContent = message.content
      message.author.send("Too short for #multi-line-rp:" + sendContent);
      message.delete().then().catch((err)=> { console.log(err)});
    }
    return;
  }

  const users = mongoServices.getDb().collection(USERS);

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
      username: username,
      posts: 0,
    };
    users.insertOne(newUser, (err, result) => {
      return handleMessage(message, newUser, update);
    });
  });
};

// Create an event listener for messages
client.on('message', message => {
  parseMessage(message, false);
});

client.on('messageUpdate', (oldMessage, message) => {
  parseMessage(message, true);
});

client.on('guildMemberAdd', member => {
  const message = `_Welcome to New Arcadia, ${member}! Have a look around, check out the gist in #welcome, feel free to just jump into making a character in #bios, or let us know if you have any questions._`
  member.guild.channels.get(OOC_CHANNEL).send(message);
})

client.on('guildMemberRemove', member => {
  const message = `_${member} has left New Arcadia and will be immediately forgotten forever who are we even talking about?_`
  member.guild.channels.get(OOC_CHANNEL).send(message);
  const users = mongoServices.getDb().collection(USERS);
  users.deleteOne({ id: member.user.id }).then(() => {});
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