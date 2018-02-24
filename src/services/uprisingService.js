const { getRandomInt, getRandomQuellingQuest, getRandomUprisingActivity, KINGDOM_COLERE_ID } = require('../utils');
const Chance = require('chance');
const Discord = require('discord.js');
const mongoServices = require('./mongoServices');
const treasuryService = require('./treasuryService');
const { each } = require('lodash');
const UPRISING_CHANCE = 10;
const returnOriginal = false;

let uprisingNumber = getRandomInt(UPRISING_CHANCE);

const createUprising = () => {
  const chance = new Chance();
  const leaderAge = chance.age({ type: 'adult' });
  const leader = `${chance.first()} ${chance.last()}, ${leaderAge}`;
  return leader;
};

const riseUp = (latestUprising) => {
  return new Promise((resolve) => {
    const uprisingCollection = mongoServices.getDb().collection('uprisings');
    uprisingCollection.findOneAndUpdate({ _id: latestUprising._id },
      { $set: { active: true, discontent: latestUprising.discontent } },
      { returnOriginal }, (err, updatedUprising) => {
        if (err) {
          console.log(err);
        }
        resolve(updatedUprising.value);
      });
  });
};

const endLatestUprising = (latestUprising) => {
  return new Promise((resolve) => {
    const uprisingCollection = mongoServices.getDb().collection('uprisings');
    uprisingCollection.findOneAndUpdate({ _id: latestUprising._id }, { $set: { active: false, discontent: 0 } }, { returnOriginal }, (err, updatedUprising) => {
      if (err) {
        console.log(err);
      }
      const nextUprising = {
        leader: createRebelLeader(),
        discontent: 0,
        active: false,
        createdAt: new Date(),
      };

      uprisingCollection.insertOne(nextUprising, (err, result) => {
        return resolve(result);
      });
    });
  });
};

const updateDiscontent = (latestUprising) => {
  return new Promise((resolve) => {
    const uprisingCollection = mongoServices.getDb().collection('uprisings');
    uprisingCollection.findOneAndUpdate({ _id: latestUprising._id }, { $set: { discontent: latestUprising.discontent } }, { returnOriginal }, (err, updatedUprising) => {
      if (err) {
        console.log(err);
      }
      resolve(updatedUprising.value);
    });
  });
};

const fetchLatestUprising = () => {
  return new Promise((resolve) => {
    const uprisingCollection = mongoServices.getDb().collection('uprisings');
    uprisingCollection.find({}, {}, { sort: { createdAt: -1 }, limit: 1 }).toArray((err, foundUprising) => {
      return resolve(foundUprising[0]);
    });
  });
};

const quellResult = (message, quelling) => {
  return new Promise((resolve) => {
    fetchLatestUprising().then((latestUprising) => {
      latestUprising.discontent -= quelling;
      if (latestUprising.discontent <= 0) {
        endLatestUprising(latestUprising).then((updated) => {
          return resolve(updated);
        })
      } else {
        updateDiscontent(latestUprising).then((updated) => {
          return resolve(updated);
        });
      }
    });
  });
};

const sendUprisingBegins = (message, text) => {
  fetchLatestUprising().then((latestUprising) => {
    const embed = new Discord.RichEmbed({
      color: 13123840,
      title: 'An Uprising Begins!',
      description: text,
      fields: [
        {
          name: 'Leader',
          value: latestUprising.leader,
        },
        {
          name: 'Uprising Strength',
          value: latestUprising.discontent,
        }
      ]
    });
    message.channel.send(embed);
  });
};

const sendUprisingUpdate = (message, text) => {
  fetchLatestUprising().then((latestUprising) => {
    const embed = new Discord.RichEmbed({
      color: 13123840,
      title: 'The Uprising Continues!',
      description: text,
      fields: [
        {
          name: 'Leader',
          value: latestUprising.leader,
        },
        {
          name: 'Uprising Strength',
          value: latestUprising.discontent,
        }
      ]
    });
    message.channel.send(embed);
  });
};

const sendUprisingEnds = (message, text) => {
  fetchLatestUprising().then((latestUprising) => {
    const embed = new Discord.RichEmbed({
      color: 13123840,
      title: 'The Uprising is Over, Long Live the Royals!',
      description: text,
      fields: [
        {
          name: 'Former Leader, Current Wormfood',
          value: latestUprising.leader,
        },
      ]
    });
    message.channel.send(embed);
  });
};

const createQuellingQuest = () => {
  const randomQuest = getRandomQuellingQuest();
  const questionEmbed = new Discord.RichEmbed({
    color: 2672690,
    title: 'Quell the Rebels',
    description: randomQuest.description,
    fields: randomQuest.fields,
  });

  const result = {
    embed: questionEmbed,
    details: randomQuest,
  };
  return result;
};

const getPeacefulDetails = (questDetails) => {
  return questDetails.fields[0];
};

const getViolentDetails = (questDetails) => {
  return questDetails.fields[1];
};

module.exports = {
  fomentDiscontent: (amount) => {
    return new Promise((resolve) => {
      fetchLatestUprising().then((latestUprising) => {
        latestUprising.discontent += amount;
        if (!latestUprising.active) {
          for (let i = 0; i < latestUprising.discontent; i++) {
            const checkUprising = getRandomInt(UPRISING_CHANCE);
            if (checkUprising === uprisingNumber) {
              riseUp(latestUprising).then(() => {
                return resolve();
              });
            }
          }
        } else {
          updateDiscontent(latestUprising).then(() => {
            return resolve();
          })
        }
      });
    });
  },
  quellUprising: (message) => {
    const quest = createQuellingQuest();
    const questionEmbed = quest.embed;
    message.channel.send(questionEmbed).then((msg) => {
      const filter = (reaction, user) => {
        if (reaction.emoji.name === '🙂' || reaction.emoji.name === '🗡') {
          return true;
        }
        return false;
      };
      const collector = msg.createReactionCollector(filter, { time: 60000 });
      collector.on('collect', (r) => {
        // console.log(`Collected ${r.emoji}`);
      });
      collector.on('end', (collected) => {
        let peaceful = 0;
        let violent = 0;
        each(collected.array(), (reaction) => {
          if (reaction._emoji.name === '🙂') {
            peaceful+=reaction.count;
          } else if (reaction._emoji.name === '🗡') {
            violent+=reaction.count;
          }
        });
        if (peaceful === violent) {
          quellResult(message, 0).then((latestUprising) => {
            sendUprisingUpdate(message, 'Bickering amongst the Royals prevents any action and the rebellion continues without change.');
          });
        } else if (peaceful > violent) {
          const details = getPeacefulDetails(quest.details);
          let quelling = getRandomInt(details.weight);
          if (Math.random() < details.risk) {
            quelling *= -1;
          }
          quellResult(message, quelling).then((latestUprising) => {
            if (quelling < 0) {
              sendUprisingUpdate(message, details.negative);
            } else {
              if (latestUprising.active) {
                sendUprisingUpdate(message, details.positive);
              } else {
                sendUprisingEnds(message, details.ended);
              }
            }
          });
        } else {
          const details = getViolentDetails(quest.details);
          let quelling = getRandomInt(details.weight);
          if (Math.random() < details.risk) {
            quelling *= -1;
          }
          quellResult(message, quelling).then((latestUprising) => {
            if (quelling < 0) {
              sendUprisingUpdate(message, details.negative);
            } else {
              if (latestUprising.active) {
                sendUprisingUpdate(message, details.positive);
              } else {
                sendUprisingEnds(message, details.ended);
              }
            }
          });
        }
      });
    });
  },
  getDiscontent: () => {
    return new Promise((resolve) => {
      fetchLatestUprising().then((latestUprising) => {
        return resolve(latestUprising.discontent);
      });
    })
  },
  isUprisingActive: () => {
    return new Promise((resolve) => {
      fetchLatestUprising().then((latestUprising) => {
        return resolve(latestUprising.active);
      });
    })
  },
  uprisingActivity: (selectedChannel) => {
    if (Math.random() < .1) {
      fetchLatestUprising().then((uprising) => {
        if (uprising.active) {
          const activity = getRandomUprisingActivity();
          const attackValue = getRandomInt(activity.attack[0], activity.attack[1]) * uprising.discontent;
          const activityEmbed = new Discord.RichEmbed({
            color: 14430740,
            title: activity.title,
            description: activity.description,
            fields: [
              {
                name: 'Cost',
                value: attackValue,
              }
            ]
          });
          treasuryService.rebelAttack(attackValue).then(() => {
            selectedChannel.send(activityEmbed);
          });
        }
      });
    }
  },
  sendUprisingUpdate,
  sendUprisingBegins,
  sendUprisingEnds,
};