const { getRandomFromArray } = require('../utils');
const quests = [
  'Your Majesties, a whole bunch of dirty peasants are causing quite the ruckus outside the castle gates, with stupid demands like "We want food" and "Our children all have dysentry."',
  'Your Grand Highnesses, the merchant caravan carrying all of the finest silks for your backsides has been attacked by bandits on the Royal Road!',
  'Your Most Excellencies, three unicorns have been spotted riding a dragon over the mountains!',
];

module.exports = {
  run: (message) => {
    message.channel.send(getRandomFromArray(quests));
  },
};
