const { getRandomFromArray } = require('../utils');
const questServices = require('../services/questServices');

const quests = [
  {
      questId: 1,
      page: 1,
      title: 'A Hunt, We\'ll Have a Hunt!',
      description: 'A rare white stag has been spotted in the Royal Forests! What would you like to do next?',
      fields: [
        {
          name: 'React with :deer:',
          value: 'Sound the horns, we are going on a hunt!',
          next: 2,
        },
        {
          name: 'React with :bed:',
          value: 'Sounds boring, lets sleep in instead.',
          weight: 50,
          next: 3,
        },
      ],
  },
];

module.exports = {
  run: (message, questNumber) => {
    if (questNumber && parseInt(questNumber, 10)) {
      questServices.beginQuest(message, parseInt(questNumber, 10));
    } else {
      questServices.beginQuest(message)
    }
  },
};
