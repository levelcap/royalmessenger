const { getRandomInt, getRandomFromArray } = require('../utils');
const Chance = require('chance');
const Discord = require('discord.js');
const emoji = require('node-emoji');
const mongoServices = require('./mongoServices');
const { each } = require('lodash');

const fetchRandomQuest = () => {
  return new Promise((resolve) => {
    const questsCollection = mongoServices.getDb().collection('quests');
    questsCollection.findOne({ questId: 1, page: 1 }, (err, quest) => {
      const questEmbed = new Discord.RichEmbed({
        color: 25855,
        title: quest.title,
        description: quest.description,
        fields: quest.fields,
        image: '/resources/images/the-end.jpg',
      });

      const result = {
        embed: questEmbed,
        details: quest,
      };
      resolve(result);
    });
  });
};

const fetchQuestPage = (questId, page) => {
  return new Promise((resolve) => {
    const questsCollection = mongoServices.getDb().collection('quests');
    questsCollection.findOne({ questId, page }, (err, quest) => {
      const questEmbed = new Discord.RichEmbed({
        color: 25855,
        title: quest.title,
        description: quest.description,
        fields: quest.fields,
      });

      const result = {
        embed: questEmbed,
        details: quest,
      };
      resolve(result);
    });
  });
};

const runQuest = (message, questResult) => {
  console.log(questResult);
  if (!questResult.details.fields) {
    endQuest(message, questResult);
  }

  const questEmbed = questResult.embed;
  const emojiArray = questEmoji(questResult);
  message.channel.send(questEmbed).then((msg) => {
    const filter = (reaction, user) => {
      if (emojiArray.includes(reaction.emoji.name)) {
        return true;
      }
      return false;
    };
    const collector = msg.createReactionCollector(filter, { time: 60000 });
    collector.on('collect', (r) => {
      console.log(`Collected ${r.emoji}`);
    });
    collector.on('end', (collected) => {
      let first = 0;
      let second = 0;
      each(collected.array(), (reaction) => {
        if (reaction._emoji.name === emojiArray[0]) {
          first += reaction.count;
        } else if (reaction._emoji.name === emojiArray[1]) {
          second += reaction.count;
        }
      });
      if (first === second) {
        // Flip a coin
        if (Math.random() < .5) {
          first++;
        } else {
          second++;
        }
      }
      let index = 0;
      if (first < second) {
        index = 1;
      }
      fetchQuestPage(questId, quest.details[index].next).then((questResult) => {
        runQuest(message, questResult);
      });
    });
  });
};

const getDetails = (questDetails) => {
  return questDetails.fields[0];
};

const questEmoji = (quest) => {
  const emojiArray = [];
  each(quest.details.fields, (field) => {
    const emojiString = field.name.replace('React with ', '');
    emojiArray.push(emojiString);
  });
  console.log(emojiArray);
  return emojiArray;
};

module.exports = {
  beginQuest: (message) => {
    const quest = fetchRandomQuest().then((questResult) => {
      runQuest(message, questResult);
    });
  },
};