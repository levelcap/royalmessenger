const { getRandomInt } = require('../utils');
const Chance = require('chance');
const Discord = require('discord.js');
const mongoServices = require('./mongoServices');
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
    uprisingCollection.findOneAndUpdate({ _id: latestUprising._id }, { $set: { active: true } }, { returnOriginal }, (err, updatedUprising) => {
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
  quellUprising: () => {
    return new Promise((resolve) => {
      fetchLatestUprising().then((latestUprising) => {
        const quelling = getRandomInt(6);
        latestUprising.discontent -= quelling;
        if (latestUprising.discontent <= 0) {
          endLatestUprising(latestUprising).then(() => {
            return resolve();
          })
        } else {
          updateDiscontent(latestUprising).then(() => {
            return resolve();
          });
        }
      });
    })
  },
  sendUprisingBegins: (message, text) => {
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
  },
  sendUprisingUpdate: (message, text) => {
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
  },
  sendUprisingEnds: (message, text) => {
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
};