require('dotenv').config();
const express = require('express');
const app = express();
const { each, get, sample } = require('lodash');
const bodyParser = require('body-parser');

const slackService = require('./services/slackService');

let lastMessages = new Map();

const CronJob = require('cron').CronJob;
const winnersJob = new CronJob('0 0 11 1 * *', () => {
  slackService.doScoring();
}, null, true, 'America/New_York');
winnersJob.start();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.get('/', (req, res) => {
  res.send('<h1>Nothing!</h1>');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`RoyalMessengers listening on ${port}`));
