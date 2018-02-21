const _ = require('lodash');

const KATE = '308403239538262028';

const titles = {
  '308403239538262028': {
    ic: [
      'His Royal Majesty King Ezra, first of his name, by the Grace of the God’s of the Luxure Kingdom and His other realms and territories, defender of the Faith, Law and the Head of Justice. Captain of the First Regiment, soldier of the Luxure Army, Ruler of the Luxure throne, it’s peoples, and its lands.',
      'His Royal Majesty King Ezra, flirst of.. flirst? No, wait, I meant first I can do better ARRRRGHHH MY SPINE',
    ],
    ooc: [
      'Her Royal Majesty Queen Kate, first of her name, zeroeth of the name Kathryn seriously just do not, of the Scouse Queendom and Her other realms and territories, including but not limited to Uni and Nandos, defender of the Accent, Spelling and sometimes even Archie if she\'s feeling generous. Captain of the Makeup Police, slave to the sesh, Ruler of the ProscriNation throne, it’s peoples, and its lands.',
      'Hey look, here comes Ka- Oh nope. There she goes. Does anyone know what "CBA" means?',
      'Everyone sit down and shut up, Kate is here!',
      'KATE she\'s GREAT and there is a CRATE because RHYMING IS HARD',
      'Shh shh shh here she comes, everyone. On three, one two three SURPRISSSEEEE HAPPY KATE DAY!',
    ],
  },
  '342295710596726785': {
    ic: [ 'Its me I am the Royal Messengers and I am here!' ],
    ooc: [
      'Kaden I guess whatever',
      'Why did he get a second one, fine its Kaden',
    ],
  },
  '272937102784724993': {
    ic: [ 'Ambers character! Shutup Ill read after Im done putting the skeleton together' ],
    ooc: [ 'Amburrrrrrrrrrrr' ],
  },
  '335859263022956544': {
    ic: [
      'There she is, Melody Luxure\n' +
      'There she is, your ideal\n' +
      'With so many beauties she took the town by storm\n' +
      'With her all-Colere face and form\n\n' +

      'And there she is\n' +
      'Walking on air, she is\n' +
      'Fairest of the fair, she is\n' +
      'There she is - Melody Luxure'
    ],
    ooc: [ 'Hannah hooray!' ],
  },
  '414858245572657153': {
    ic: [ 'Second Prince of Colere, former ranking Captain of the artillery regiment. The famed Ice Prince, Atlas Luxure!' ],
    ooc: [
      'The Ice Prince is here, bitches.',
      'His reigning Dark King of Eton, Archibald.',
      'Archie heard ya talking shit, bitch. Bye, Felicia!',
    ],
  },
  '335417626417299456': {
    ic: [ 'Nellys character has a name, I assume!' ],
    ooc: [ 'Nelly nelly nelly nelly nelly nelly' ],
  },
  '324949897415753747': {
    ic: [ 'Here comes the bard dressed all in light\n' +
      'Radiant and lovely he shines in  sight\n' +
      'Gently he glides graceful as a dove\n' +
      'Meeting his fans his eyes full of love.\n\n' +

      'Love have they waited long have they planned\n' +
      'Life goes before them opening his hand.' ],
    ooc: [ 'Not really sure on who Lo is so have a placeholder' ],
  },
  '283028963360636929': {
    ic: [ 'Ladies and gentlemen, a person, place or thing!' ],
    ooc: [ 'I also do not know Hex' ],
  },
  '196463358461870081': {
    ic: [ 'I know so few of these people. Am I bad at my job?' ],
    ooc: [ 'Quoth the Raven, I dunno, something something' ],
  }
};

const quellingMissions = [
  {
    description: 'The rebels have barricaded a part of the slums, what should we do next?',
    fields: [
      {
        name: 'React with 🙂',
        value: 'Send a negotiator down to the slums, but make sure they shower before they come back.',
        weight: 10,
        risk: .01,
        positive: 'Talks did some good to cool the situation, but the rebellion continues to plague Colere.',
        negative: 'The negotiator does not return, but you see him once more, head planted firmly atop a spear on the barricade.',
        ended: 'Negotiation succeeds where violence may have failed, the rebellion has ended, long live the Royals!',
      },
      {
        name: 'React with 🗡',
        value: 'Send in the guards to murder the ever-loving shit out of those rebellious cunts!',
        weight: 50,
        risk: .2,
        positive: 'Long hours of bloody fighting have quieted the rebels, but they are not yet done fighting.',
        negative: 'Damn their poor-person arms, beefy from lifting sacks of dirt to eat! The peasants fight the guards off the barricade and the rebellion grows stronger!',
        ended: 'You have crushed the rebellious serfs to place the Royals back in their rightful place as the rulers of Colere.',
      },
    ],
  },
  {
    description: 'The rebels have sent an envoy to the palace, how should we receive him?',
    fields: [
      {
        name: 'React with 🙂',
        value: 'Treat them as a visiting dignitary, with respect and kindness',
        weight: 40,
        risk: .02,
        positive: 'Talks go surprisingly well, and the envoy returns to calm his fellow rebels some.',
        negative: 'Talking go terribly, and the envoy leaves even madder than when they arrived!',
        ended: 'You are master negotiators, the envoy leaves in a daze, somehow having agreed to end the rebellion and cede the Royals his hovel in return. Huzzah!',
      },
      {
        name: 'React with 🗡',
        value: 'Slit their throat and feed their corpse to the dogs',
        weight: 10,
        risk: .5,
        positive: 'The rebels tremble as word leaks of your violent reaction to their peaceful overture, none are eager to try again.',
        negative: 'How did that not work?! The dumb rebels seem ALL MAD that you murdered their peaceful negotiator. Jerks.',
        ended: 'Jesus, you really did a number on that guy. Urine runs through the gutters as the rebellion sputters out overnight at word of your unrestrained violence.',
      },
    ],
  },
  {
    description: 'Peasants are storming one of the grain warehouses like they want food or something. What do we do?',
    fields: [
      {
        name: 'React with 🙂',
        value: 'The warehouse manager will definitely be able to handle this via communication, no worries here',
        weight: 100,
        risk: 1,
        positive: 'This should never happen, but that somehow worked?',
        negative: 'So yeah, that guy is hundo-p dead and now the rebels are well fed as well as angry. Good work.',
        ended: 'This double should never happen, but you have ended the rebellion by doing nothing.',
      },
      {
        name: 'React with 🗡',
        value: 'A cavalry charge down the main thoroughfare should sort this out nicely.',
        weight: 80,
        risk: .1,
        positive: 'The charge massacres hundreds, churning the streets into a viscous red mush beneath the stomping hooves of the Royal Cavalry. The rebels will not soon try that again.',
        negative: 'Disaster! Forming a rudimentary spear-wall, the peasant somehow managed to unhorse a Captain of the Royal Cavalry and have been dragging him through the streets behind his own horse for hours!',
        ended: 'They\'re dead, they`re all dead! Those that were not caught in the mighty charge are left to die, starving in the gutters as the Royals throw a banquet in their own honor. To being rich and powerful forever!',
      },
    ],
  }
];

const getRandomFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
};

module.exports = {
  getTitle: (ooc, user) => {
    const titleObj = user.titles || titles[userId];
    if (titleObj) {
      if (ooc) {
        return getRandomFromArray(titleObj.ooc);
      } else {
        return getRandomFromArray(titleObj.ic);
      }
    } else {
      return null;
    }
  },
  getRandomQuellingQuest: () => {
    return getRandomFromArray(quellingMissions);
  },
  getRandomFromArray,
  getRandomInt,
  KATE,
};