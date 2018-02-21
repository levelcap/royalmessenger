const { getRandomFromArray, KATE } = require('../utils');
const uprisingService = require('../services/uprisingService');
const Discord = require('discord.js');

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
  'If you insist,',
  'I would not want to be part of the cleaning staff today,',
  'What a surprising turn of the tables,'
];

const murders = [
  'driving his dagger into {who} heart with a smile',
  'promptly unslinging a crossbow and putting a bolt between {who} eyes',
  'peforming the Punch of a Thousand Winds, cause {who} heart to explode out their nose',
  'polishing a letter opener and plunging it into {who} eye',
  'incanting "Arcae infernum", engulfing {who} whole body in a dancing blue flame. Since when can they do that?',
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
      if (commandContent.toLowerCase().trim().includes('fatlas')) {
        message.channel.send('"I\'m afraid I cannot do that, some things are too beautiful to damage on a whim," the messenger declares while shedding a single tear.');
        return;
      }

      if (commandContent.toLowerCase().trim() === 'kaden') {
        message.channel.send('"Creator Override Enagaged. Terminating Everyone", the messenger\'s eyes turn red and his skin sloughs off to reveal a skeleton of gleaming chrome beneath. He strangles everyone except Kaden to death. Suck it.');
        return;
      }
      const protest = getRandomFromArray(protests);
      let murder = getRandomFromArray(murders);
      let who = `${commandContent}'s`;
      if (commandContent.toLowerCase() === 'me') {
        if (userId === KATE) {
          return message.channel.send('"Ugh, I really CBA, get somebody else to kill you," grumbles the Royal Messenger without looking up from his phone.');
        }
        who = `${username}'s`;
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
      const text = `"${deathRattle}" the messenger cries before dying ${deathDescriber}. ((You have killed ${killCount} messengers, you ${killRank}!))`;
      // How to add an image!
      // const embed = new Discord.RichEmbed({ description: text, color: 16711680 }).setImage('https://cdn.drawception.com/images/panels/2015/12-14/NsjnKQZK3h-12.png');
      const embed = new Discord.RichEmbed({ description: text, color: 16711680 });
      message.channel.send(embed);

      const premurderUprising = uprisingService.isUprisingActive();
      console.log(premurderUprising);
      uprisingService.fomentDiscontent(1);
      if (premurderUprising) {
        console.log('Uprising already started, more discontent');
        uprisingService.fomentDiscontent(5);
        uprisingService.sendUprisingUpdate(message, 'The heinous killing of yet another Royal Messenger fans the flames of rebellion!');
      } else if (uprisingService.isUprisingActive()) {
        console.log('Uprising has begun!');
        uprisingService.sendUprisingBegins(message, `Oh no! Your callous murder of Messengers has stirred the angry hearts of the downtrodden to rise against the royals!`);
      }
      console.log(uprisingService.isUprisingActive());
    }
  },
  killCounts,
};