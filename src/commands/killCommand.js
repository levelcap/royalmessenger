const { getRandomFromArray } = require('../utils');

const deathRattles = [
  'BLARGH!',
  'ARGH me liver!',
  'Tell my wife I had two mistresses...',
  'Oh shit that hurts...',
  'Ziggy, leap me out of here!',
  'I\'m on so much fire!',
  'Why are you still stabbing, I\'m clearly already dying!',
  'THE PAIN THE PAIN',
];

const deathDescribers = [
  'horribly',
  'with a relieved smile',
  'weeping for their mother',
  'in a pool of blood and viscera',
  'while shitting uncontrollably',
  'with a gut full of knives',
  'choking on their own vomit',
  'well before their time',
  'in front of their crying children',
  'like a wuss',
  'slowly and painfully'
];

const protests = [
  'Oh, I couldn\'t possibly',
  'This goes too far, but on second though, sure',
];

const murders = [
  'driving his dagger into {who} heart with a smile',
  'promptly unslinging a crossbow and putting a bolt between {who} eyes',
];

const killCounts = new Map();
const getKillRank = (killCount) => {
  if (killCount < 2) {
    return 'stab-happy amateur';
  } else if (killCount < 5) {
    return 'rampaging lunatic';
  } else if (killCount < 10) {
    return 'murderous barbarian';
  } else if (killCount < 20) {
    return 'blood-drenched monster';
  } else  {
    return 'unholy tyrant';
  }
};

module.exports = {
  run: (message, userId, username, commandContent) => {
    if (commandContent) {
      const protest = getRandomFromArray(protests);
      let murder = getRandomFromArray(murders);
      let who = `${commandContent}'s`;
      if (commandContent.toLowerCase() === 'me') {
        who = 'your';
      }
      murder = murder.replace('{who}', who);
      message.channel.send(`"${protest}", says the Royal Messenger before ${murder}.`);

    } else {
      let killCount = killCounts.get(userId) || 0;
      killCount++;
      killCounts.set(userId, killCount);
      const deathRattle = getRandomFromArray(deathRattles);
      const deathDescriber = getRandomFromArray(deathDescribers);
      const killRank = getKillRank(killCount);
      message.channel.send(`"${deathRattle}" the messenger cries before dying ${deathDescriber}. ((You have killed ${killCount} messengers, you ${killRank}!))`);
    }
  },
  killCounts,
};