const { getRandomInt, getRandomFromArray } = require('../utils');
const Chance = require('chance');
const Discord = require('discord.js');
const emoji = require('node-emoji');
const mongoServices = require('./mongoServices');
const { each, map } = require('lodash');

const fetchRandomQuest = () => {
  return new Promise((resolve) => {
    const questsCollection = mongoServices.getDb().collection('quests');
    questsCollection.find({ page: 1 }, { questId: 1 }).toArray((questFindErr, questIdResults) => {
      const questIds = map(questIdResults, (questIdResult) => questIdResult.questId);
      const randomQuest = getRandomFromArray(questIds);
      questsCollection.findOne({ questId: randomQuest, page: 1 }, (err, quest) => {
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

const endQuest = (message, endQuestDetails) => {
  const questEmbed = new Discord.RichEmbed({
    color: 0,
    title: endQuestDetails.title,
    description: endQuestDetails.description,
  });
  const imageUrl = endQuestDetails.endImage || `${process.env.BASE_URL}/images/the-end.jpg`;
  questEmbed.setImage(imageUrl);
  message.channel.send(questEmbed);
};

const runQuest = (message, questResult) => {
  if (!questResult.details.fields) {
    return endQuest(message, questResult.details);
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
    const collector = msg.createReactionCollector(filter, { time: 30000 });
    collector.on('collect', (r) => {
      // console.log(`Collected ${r.emoji}`);
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
      fetchQuestPage(questResult.details.questId, questResult.details.fields[index].next).then((nextQuestPage) => {
        runQuest(message, nextQuestPage);
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
  return emojiArray;
};

const getQuests = (questId) => {
  return new Promise((resolve) => {
    const questsCollection = mongoServices.getDb().collection('quests');
    if (questId) {
      questsCollection.find({ questId: parseInt(questId, 10) }).sort({ page: 1 }).toArray((err, quests) => {
        console.log(quests);
        resolve(quests);
      });
    } else {
      questsCollection.find({ page: 1 }).toArray((questErr, quests) => {
        resolve(quests);
      });
    }
  });
};

const getQuestPage = (questPageId) => {
  return new Promise((resolve) => {
    const questsCollection = mongoServices.getDb().collection('quests');
    questsCollection.findOne({ _id: questPageId }, (err, questPage) => {
      resolve(questPage);
    });
  });
};

module.exports = {
  beginQuest: (message, questNumber) => {
    if (!questNumber) {
      const quest = fetchRandomQuest().then((questResult) => {
        runQuest(message, questResult);
      });
    } else {
      const quest = fetchQuestPage(questNumber, 1).then((questResult) => {
        runQuest(message, questResult);
      });
    }
  },
  questList: (questId) => {
    return getQuests(questId);
  },
  questPage: (questPageId) => {
    return getQuestPage(questPageId);
  },
  addQuestPage: (form) => {
    return new Promise ((resolve, reject) => {
      const questId = parseInt(form.questId, 10);
      const title = form.title;
      const description = form.description;
      const page = parseInt(form.pageNumber, 10);
      const endImage = form.endImage;
      const option1 = form.option1;
      const option1Page = parseInt(form.option1Page, 10);
      const option1Text = form.option1Text;
      const option2 = form.option2;
      const option2Page = parseInt(form.option2Page, 10);
      const option2Text = form.option2Text;

      if (!questId || !page) {
        console.log(form);
        console.log('Could not resolve questId or pageNumber to an integer.');
        return reject();
      }

      const questObj = {
        questId,
        page,
        title,
        description
      };

      if (endImage) {
        questObj.endImage = endImage;
      } else if (option1Page && option2Page) {
        questObj.fields = [
          {
            name: `React with ${option1}`,
            value: option1Text,
            next: option1Page,
          },
          {
            name: `React with ${option2}`,
            value: option2Text,
            next: option2Page,
          }
        ];
      } else {
        return reject();
      }

      const questsCollection = mongoServices.getDb().collection('quests');
      questsCollection.insertOne(questObj, (err, saveRes) => {
        return resolve();
      });
    });
  },
};