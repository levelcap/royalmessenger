const moment = require('moment');
const Slack = require('slack')
const { each } = require('lodash');

const slackToken = process.env.SLACK_TOKEN;
const CHANNELS = {
  GAMES: "C95AK9BJ6",
  BOT: "CUEHVGZBR",
};

const slackApi = new Slack({
  token: slackToken,
});

console.log("Turned it on!");

module.exports = {
  doScoring: () => {
    const oneMonthAgo = moment().subtract(1, 'months');
    const scoreMap = new Map();
    const SCORED_REACTIONS = ['goodgoldfish', 'badowl', 'stinkbug'];
    slackApi.conversations.history({channel: CHANNELS.GAMES, oldest: oneMonthAgo.unix(), limit: 999}).then(history => {
      each(history.messages, (message) => {
        if (message.type !== 'message') {
          return;
        }

        const ts = moment.unix(message.ts);
        if (ts < oneMonthAgo) {
          return;
        }

        if (!message.reactions) {
          return;
        }

        let userScores = scoreMap.get(message.user);
        if (!userScores) {
          userScores = new Map();
          each(SCORED_REACTIONS, (reaction) => {
            userScores.set(reaction, 0);
          });
        }
        each(message.reactions, (reaction) => {
          if (SCORED_REACTIONS.includes(reaction.name)) {
            const score = reaction.count;
            let rScore = userScores.get(reaction.name);
            if (!rScore) {
              rScore = 0;
            }
            rScore += score;
            userScores.set(reaction.name, rScore);
          }
        });

        scoreMap.set(message.user, userScores);
      });
      slackApi.users.list().then(users => {
        const userIdNameMap = new Map();
        each(users.members, (user) => {
          userIdNameMap.set(user.id, user.real_name);
        });

        let stinkbugWinner = [0, ''];
        let owlWinner = [0, ''];
        let goldfishWinner = [0,''];

        scoreMap.forEach((value, key) => {
          const stinkbug = value.get('stinkbug');
          const goldfish = value.get('goodgoldfish');
          const owl = value.get('badowl')
          if (stinkbugWinner[0] <= stinkbug) {
            stinkbugWinner = [stinkbug, userIdNameMap.get(key)];
          }

          if (owlWinner[0] <= owl) {
            owlWinner = [owl, userIdNameMap.get(key)];
          }

          if (goldfishWinner[0] <= goldfish) {
            goldfishWinner = [goldfish, userIdNameMap.get(key)];
          }
        });

        const text = "Winners!";
        const blocks = [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": ":trophy: *The Monthly GrrrArrgy Winners!* :trophy:"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*The Goodest Goldfish Is...*\n_${goldfishWinner[1]}_ with ${goldfishWinner[0]} :goodgoldfish:s!`,
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*The Most Evil Owl Is...:*\n_${owlWinner[1]}_ with ${owlWinner[0]} :badowl:s`,
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*The Stinkbug - _BECAUSE THEY STINK_ - Is...:*\n_${stinkbugWinner[1]}_ with ${stinkbugWinner[0]} :stinkbug:s`,
            }
          }
        ];
        slackApi.chat.postMessage({channel: CHANNELS.BOT, text, blocks});
      });
    });
  },
};
