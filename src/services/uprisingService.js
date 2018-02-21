const { getRandomInt } = require('../utils');
const Chance = require('chance');
const Discord = require('discord.js');
const UPRISING_CHANCE = 10;

let uprisingActive = false;
let discontent = 0;
let uprisingNumber = getRandomInt(UPRISING_CHANCE);
let latestUprising = {};
let leader = '';

const createUprising = () => {
  const chance = new Chance();
  const leaderAge = chance.age({type: 'adult'});
  leader = `${chance.first()} ${chance.last()}, ${leaderAge}`;
};

module.exports = {
  fomentDiscontent: (amount) => {
    discontent += amount;
    if (!uprisingActive) {
      console.log(`Uprising Number: ${uprisingNumber}`);
      for (let i = 0; i < discontent; i++) {
        const checkUprising = getRandomInt(UPRISING_CHANCE);
        if (checkUprising === uprisingNumber) {
          createUprising();
          uprisingActive = true;
          console.log('Uprising!');
          return;
        }
      }
    }
  },
  quellUprising: () => {
    const quelling = getRandomInt(6);
    discontent -= quelling;
    if (discontent <= 0) {
      uprisingActive = false;
      discontent = 0;
    }
  },
  sendUprisingBegins: (message, text) => {
    const embed = new Discord.RichEmbed({
      color: 13123840,
      title: 'An Uprising Begins!',
      description: text,
      fields: [
        {
          name: 'Leader',
          value: leader,
        },
        {
          name: 'Uprising Strength',
          value: discontent,
        }
      ]
    });
    message.channel.send(embed);
  },
  sendUprisingUpdate: (message, text) => {
    const embed = new Discord.RichEmbed({
      color: 13123840,
      title: 'The Uprising Continues!',
      description: text,
      fields: [
        {
          name: 'Leader',
          value: leader,
        },
        {
          name: 'Uprising Strength',
          value: discontent,
        }
      ]
    });
    message.channel.send(embed);
  },
  sendUprisingEnds: (message, text) => {
    const embed = new Discord.RichEmbed({
      color: 13123840,
      title: 'The Uprising is Over, Long Live the Royals!',
      description: text,
      fields: [
        {
          name: 'Former Leader, Current Wormfood',
          value: leader,
        },
      ]
    });
    message.channel.send(embed);
  },
  discontent,
  latestUprising,
  uprisingActive,
};