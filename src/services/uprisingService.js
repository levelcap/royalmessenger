const { getRandomInt } = require('../utils');
const Chance = require('chance');
const Discord = require('discord.js');
const mongoServices = require('./mongoServices');
const { each } = require('lodash');
const UPRISING_CHANCE = 10;
const returnOriginal = false;

let uprisingNumber = getRandomInt(UPRISING_CHANCE);

const createUprising = () => {
  return new Promise((resolve) => {
    const chance = new Chance();
    const leaderAge = chance.age({ type: 'adult' });
    const leader = `${chance.first()} ${chance.last()}, ${leaderAge}`;
    return resolve(leader);
  });
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
    uprisingCollection.findOneAndUpdate({ _id: latestUprising._id }, { $set: { active: true } }, { returnOriginal }, (err, updatedUprising) => {
      if (err) {
        console.log(err);
      }
      resolve(updatedUprising.value);
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
      console.log(quelling);
      console.log(latestUprising);
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

const getRandomQuellingMission = () => {
  const questionEmbed = new Discord.RichEmbed({
    color: 2672690,
    title: 'Quell the Rebels',
    description: 'The rebels have barricaded a part of the slums, what should we do next? (Voting open for 60s)',
    fields: [
      {
        name: 'React with 🙂',
        value: 'Talk it out, we\'re all bros here',
      },
      {
        name: 'React with 🗡',
        value: 'Stab their goddamn peasant faces until they shut up about it already!',
      },
    ],
  });

  return questionEmbed;
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
    const questionEmbed = getRandomQuellingMission();
    message.channel.send(questionEmbed).then((msg) => {
      const filter = (reaction, user) => {
        if (reaction.emoji.name === '🙂' || reaction.emoji.name === '🗡') {
          return true;
        }
        return false;
      };
      const collector = msg.createReactionCollector(filter, { time: 60000 });
      collector.on('collect', (r) => {
        console.log(`Collected ${r.emoji}`);
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
          let quelling = getRandomInt(4);
          if (getRandomInt(8) % 4 === 0) {
            quelling *= -1;
          }
          quellResult(message, quelling).then((latestUprising) => {
            if (latestUprising.active) {
              sendUprisingUpdate(message, 'Talks did some good to cool the situation, but the rebellion continues to plague Colere.');
            } else {
              sendUprisingEnds(message, 'Negotiation succeeds where violence may have failed, the rebellion has ended, long live the Royals!');
            }
          });
        } else {
          let quelling = getRandomInt(10);
          if (getRandomInt(8) % 2 === 0) {
            quelling *= -1;
          }
          quellResult(message, quelling).then((latestUprising) => {
            if (latestUprising.active) {
              sendUprisingUpdate(message, 'Long hours of bloody fighting have quieted the rebels, but they are not yet done fighting.');
            } else {
              sendUprisingEnds(message, 'You have crushed the rebellious serfs to place the Royals back in their rightful place as the rulers of Colere.');
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
  sendUprisingUpdate,
  sendUprisingBegins,
  sendUprisingEnds,
};