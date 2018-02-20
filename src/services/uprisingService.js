const { getRandomInt } = require('../utils');
const Chance = require('chance');
const UPRISING_CHANCE = 10;

let uprisingActive = false;
let uprisingCounter = 0;
let uprisingNumber = getRandomInt(UPRISING_CHANCE);
const latestUprising = {};

const createUprising = () => {
  const chance = new Chance();
  latestUprising.age = chance.age({type: 'adult'});
  latestUprising.first = chance.first();
  latestUprising.last = chance.last();
};

module.exports = {
  incrementUprising: () => {
    uprisingCounter++;
    if (!uprisingActive) {
      for (let i = 0; i < uprisingCounter; i++) {
        const checkUprising = getRandomInt(UPRISING_CHANCE);
        if (checkUprising === uprisingNumber) {
          createUprising();
          uprisingActive = true;
          return true;
        }
      }
    }
    return false;
  },
  quellUprising: () => {
    uprisingActive = false;
  },
  latestUprising,
  uprisingActive,
};