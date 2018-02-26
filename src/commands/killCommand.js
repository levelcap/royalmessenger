const { getRandomFromArray, KATE } = require('../utils');
const uprisingService = require('../services/uprisingService');
const mongoServices = require('../services/mongoServices');
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
  'OW ME CHEST, MAN',
  'I\'m still alive!',
  'Don\'t shoot the messenger!',
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
  'slowly and painfully',
  'while staring at the sword sticking out of his chest',
  'when an arrow thunks into the back of his head',
];

const protests = [
  'Oh, I couldn\'t possibly',
  'This goes too far, but on second thought, sure',
  'If you insist,',
  'I would not want to be part of the cleaning staff today,',
  'What a surprising turn of the tables,'
];

const murders = [
  'driving his dagger into {who} heart with a smile',
  'promptly unslinging a crossbow and putting a bolt between {who} eyes',
  'peforming the Punch of a Thousand Winds, causing {who} heart to explode out their nose',
  'polishing a letter opener and plunging it into {who} eye',
  'incanting "Arcae infernum", engulfing {who} whole body in a dancing blue flame. Since when can they do that?',
];

const kateSuicide = [
  '"Ugh, I really CBA, get somebody else to kill you," grumbles the Royal Messenger without looking up from his phone.',
  '"Yeah but that sounds like a lot of effort," the Royal Messenger says while wandering off',
];

const getKillRank = (killCount) => {
  if (killCount < 10) {
    return 'stab-happy amateur';
  } else if (killCount < 25) {
    return 'rampaging lunatic';
  } else if (killCount < 50) {
    return 'murderous barbarian';
  } else if (killCount < 100) {
    return 'blood-drenched monster';
  } else if (killCount < 1000) {
    return 'unholy tyrant';
  } else if (killCount < 2500) {
    return 'insane god of slaughter';
  } else if (killCount < 5000) {
    return 'walking extinction-level event';
  } else if (killCount < 10000) {
    return 'supernova of carnage';
  } else {
    return 'annihilation wave running rampant through a once life-filled universe. Seriously what is wrong with you?';
  }
};

const fetchOrCreateKills = (kills, user) => {
  return new Promise((resolve) => {
    kills.findOne({ userId: user._id }, (err, foundKills) => {
      if (!foundKills) {
        const killsObj = {
          userId: user._id,
          killCount: 0,
        };
        kills.insertOne(killsObj, (err) => {
          if (err) {
            console.log(err);
          }
          resolve(killsObj);
        })
      } else {
        resolve(foundKills);
      }
    });
  });
};

const incrementKills = (kills, user, amount) => {
  return new Promise((resolve) => {
    kills.findOneAndUpdate({ userId: user._id }, { $inc: { killCount: amount } }, { returnOriginal: false }, (err, updatedKills) => {
      if (err) {
        console.log(err);
      }
      resolve(updatedKills.value);
    });
  });
};

module.exports = {
  run: (message, user, commandContent) => {
    const db = mongoServices.getDb();
    const kills = db.collection('kills');

    if (commandContent) {
      if (commandContent.toLowerCase().trim().includes('fatlas')) {
        message.channel.send('"I\'m afraid I cannot do that, some things are too beautiful to damage on a whim," the messenger declares while shedding a single tear.');
        return;
      }

      if (commandContent.toLowerCase().trim() === 'kaden') {
        // message.channel.send('"Creator Override Enagaged. Terminating Everyone", the messenger\'s eyes turn red and his skin sloughs off to reveal a skeleton of gleaming chrome beneath. He strangles everyone except Kaden to death. Suck it.');
        message.channel.send('"No problemo, boss," the Royal Messenger says with a thumbs up and a wink before driving that same thumb into Kaden\'s throat and watching while he squirms and dies. "So uhhhhhh... who wants to update this thing now?"');
        return;
      }

      if (commandContent.toLowerCase().includes('vera')) {
        message.channel.send('"Of course, Your Most Beneficientness, just one moment while I... now!" ' +
          'At the Royal Messenger\'s cry, dozens of men and women wielding crossbows appear from THE SHADOWS and open fire on you. ' +
          'The Royal Messenger laughs manically and holds a rusty sword high, "Long live Vera Rhodes, hero of the rebellion!"');
        return;
      }

      const protest = getRandomFromArray(protests);
      let murder = getRandomFromArray(murders);
      let who = `${commandContent}'s`;
      if (commandContent.toLowerCase() === 'me') {
        if (user._id === KATE) {
          return message.channel.send(getRandomFromArray(kateSuicide));
        }
        who = `${user.name}'s`;
      }
      murder = murder.replace('{who}', who);
      message.channel.send(`"${protest}", says the Royal Messenger before ${murder}.`);

    } else {
      let premurderUprising = false;
      fetchOrCreateKills(kills, user)
        .then((killObj) => {
          return incrementKills(kills, user, 1);
        })
        .then((updatedKills) => {
          const killCount = updatedKills.killCount;
          const deathRattle = getRandomFromArray(deathRattles);
          const deathDescriber = getRandomFromArray(deathDescribers);
          const killRank = getKillRank(killCount);
          const text = `"${deathRattle}" the messenger cries before dying ${deathDescriber}. ((You have killed ${killCount} messengers, you ${killRank}!))`;
          // How to add an image!
          // const embed = new Discord.RichEmbed({ description: text, color: 16711680 }).setImage('https://cdn.drawception.com/images/panels/2015/12-14/NsjnKQZK3h-12.png');
          const embed = new Discord.RichEmbed({ description: text, color: 16711680 });
          message.channel.send(embed);

          return uprisingService.isUprisingActive();
        })
        .then((active) => {
          premurderUprising = active;
          return premurderUprising;
        }).then(() => {
        return uprisingService.fomentDiscontent(1);
      }).then(() => {
        if (premurderUprising) {
          uprisingService.fomentDiscontent(5).then(() => {
            uprisingService.sendUprisingUpdate(message, 'The heinous killing of yet another Royal Messenger fans the flames of rebellion!');
          });
        } else {
          uprisingService.isUprisingActive().then((active) => {
            if (active) {
              uprisingService.sendUprisingBegins(message, `Oh no! Your callous murder of Messengers has stirred the angry hearts of the downtrodden to rise against the royals!`);
            }
          });
        }
      })
        .catch((err) => {
          console.log('Something went wrong!');
          console.log(err);
        });
    }
  },
};