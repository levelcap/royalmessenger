const { getRandomInt, getRandomFromArray, KINGDOM_COLERE_ID } = require('../utils');
const Discord = require('discord.js');
const mongoServices = require('./mongoServices');
const { get } = require('lodash');
const MAX_BORROW_PERCENT = .001;
const returnOriginal = false;

const getKingdomWealth = (kingdomId) => {
  return new Promise((resolve) => {
    const kingdomCollection = mongoServices.getDb().collection('kingdoms');
    kingdomCollection.findOne({ _id: kingdomId }, (err, kingdom) => {
      return resolve(kingdom);
    });
  });
};

const updateUserWealth = (addedWealth, addedDebt, user) => {
  return new Promise((resolve) => {
    const userCollection = mongoServices.getDb().collection('users');
    userCollection.findOneAndUpdate({ _id: user._id }, { $inc: { 'wealth.gold': addedWealth, 'wealth.debt': addedDebt } }, { returnOriginal }, (err, updatedUser) => {
      return resolve(updatedUser);
    });
  });
};

const updateKingdomWealth = (addedWealth, kingdomId) => {
  return new Promise((resolve) => {
    const kingdomCollection = mongoServices.getDb().collection('kingdoms');
    kingdomCollection.findOneAndUpdate({ _id: kingdomId }, { $inc: { treasury: addedWealth } }, { returnOriginal }, (err, updatedUser) => {
      return resolve(updatedUser);
    });
  });
};

module.exports = {
  getWealth: (message, user) => {
    getKingdomWealth(KINGDOM_COLERE_ID).then((kingdom) => {
      const wealthEmbed = new Discord.RichEmbed({
        color: 16766720,
        title: 'Gold, Glorious Gold!',
        description: 'https://www.youtube.com/watch?v=ui-Wp0kNgQw',
        fields: [
          {
            name: 'Personal Gold',
            value: (get(user, 'wealth.gold') || 0) + ' gold',
          },
          {
            name: 'Personal Debt',
            value: (get(user, 'wealth.debt') || 0) + ' gold',
          },
          {
            name: `${kingdom.name} Treasury`,
            value: (get(kingdom, 'treasury') || 0) + ' gold',
          },
        ]
      });
      wealthEmbed.setURL('https://www.youtube.com/watch?v=ui-Wp0kNgQw');
      wealthEmbed.setImage('https://media.giphy.com/media/n59dQcO9yaaaY/giphy.gif');
      message.channel.send(wealthEmbed);
    });
  },
  borrow: (message, user, amount) => {
    getKingdomWealth(KINGDOM_COLERE_ID).then((kingdom) => {
      if ((amount / kingdom.treasury) <= MAX_BORROW_PERCENT) {
        updateKingdomWealth((amount * -1), KINGDOM_COLERE_ID).then(() => {
          return updateUserWealth(amount, amount, user);
        }).then(() => {
          message.channel.send(`The Treasury has lent you ${amount} gold, which will definitely never have any repercussions.`);
        });
      } else {
        message.channel.send('The Treasury will not allow you to borrow that much.');
      }
    });
  },
  repay: (message, user, amount) => {
    if (user.wealth.gold >= amount) {
      updateKingdomWealth(amount, KINGDOM_COLERE_ID).then(() => {
        return updateUserWealth((amount * -1), (amount * -1), user);
      }).then(() => {
        message.channel.send(`You have repaid ${amount} of your debt.`);
      });
    } else {
      return message.channel.send('You cannot repay more money than you have without borrowing money first which is how you got into this situation in the first place.');
    }
  },
  rebelAttack: (attackValue) => {
    return new Promise((resolve) => {
      getKingdomWealth(KINGDOM_COLERE_ID).then((kingdom) => {
        if (kingdom.treasury < attackValue) {
          attackValue = kingdom.treasury;
        }
        updateKingdomWealth((attackValue * -1), KINGDOM_COLERE_ID).then(() => {
          return resolve();
        });
      });
    });
  },
};
