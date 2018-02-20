const _ = require('lodash');

const KATE = '308403239538262028';
const THORSUS = '342295710596726785';
const AMBER = '272937102784724993';
const HANNAH = '335859263022956544';
const ARCHIE = '414858245572657153';
const NELLY = '335417626417299456';
const LOLO = '324949897415753747';
const HEXUS = '283028963360636929';
const RAVEN = '196463358461870081';

const mods = [ KATE, THORSUS, AMBER, HANNAH, ARCHIE ];

const titles = {
  '308403239538262028': {
    ic: [
      'His Royal Majesty King Ezra, first of his name, by the Grace of the God’s of the Luxure Kingdom and His other realms and territories, defender of the Faith, Law and the Head of Justice. Captain of the First Regiment, soldier of the Luxure Army, Ruler of the Luxure throne, it’s peoples, and its lands.',
      'His Royal Majesty King Ezra, flirst of.. flirst? No, wait, I meant first I can do better ARRRRGHHH MY SPINE',
    ],
    ooc: [
      'Her Royal Majesty Queen Kate, first of her name, zeroeth of the name Kathryn seriously just do not, of the Scouse Queendom and Her other realms and territories, including but not limited to Uni and Nandos, defender of the Accent, Spelling and sometimes even Archie if she\'s feeling generous. Captain of the Makeup Police, slave to the sesh, Ruler of the ProscriNation throne, it’s peoples, and its lands.',
      'Hey look, here comes Ka- Oh nope. There she goes. Does anyone know what "CBA" means?'
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
    ic: [ 'His Royal something the guy that Archie plays, the sneering one' ],
    ooc: [ 'The Ice Prince is here, bitches.' ],
  },
  '335417626417299456': {
    ic: [ 'Nellys character has a name, I assume!' ],
    ooc: [ 'Nelly nelly nelly nelly nelly nelly' ],
  },
  '324949897415753747': {
    ic: [ 'Preeesenting this... this guy right here' ],
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

const getRandomFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

module.exports = {
  getTitle: (ooc, userId) => {
    const titleObj = titles[userId];
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
  getRandomFromArray,
  isMod: (userId) => {
    return  mods.includes(userId);
  },
};