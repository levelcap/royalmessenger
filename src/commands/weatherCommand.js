const request = require('request');
const moment = require('moment');
const darkSkyApiBase = "https://api.darksky.net";
const darkSkyKey = process.env.DARK_SKY_KEY;
const forecastUrl = `${darkSkyApiBase}/forecast/${darkSkyKey}/46.4956554,-123.3184781`;

const lastReport = {
  checked: null,
  report: "The weather channel shows only static. Weird."
}

const cachedReport = () => {
  const now = moment();
  return lastReport.checked && ( now.diff(lastReport.checked, 'hours') < 4)
};

const getMagicalWeather = () => {
  d20 = Math.floor(Math.random() * Math.floor(19)) + 1;
  if (d20 === 20){
    return "healing winds";
  } else if (d20 === 1) {
    return "red lightning filled with ghosts";
  } else {
    return false;
  }
}

module.exports = {
  run: (message) => {
    request(forecastUrl, (error, response, body) => {
      if (error || response.statusCode != 200) {
        console.log('Problem getting the weather: ' + error);
        message.channel.send("The weather channel shows only static and you think you can hear the distant voice of your grandfather beyond it. Weird.");
        return;
      }

      if (cachedReport()) {
        console.log('Using cached weather report.');
        message.channel.send(lastReport.report);
        return;
      }

      const json = JSON.parse(body);
      const currently = json.currently;
      const temp = Math.floor(currently.temperature)
      const precipProb = Math.floor(currently.precipProbability * 100)
      let precipType = currently.precipType;
      magicalWeather = getMagicalWeather();
      if (magicalWeather) {
        precipType = magicalWeather;
      }
      let report = `Tamara Frey of WNAR says today will be ${currently.summary.toLowerCase()} and ${temp}F`;
      if (precipProb > 15) {
        report += ` with a ${precipProb}% chance of ${precipType}`;
      }
      lastReport.checked = moment();
      lastReport.report = report;
      message.channel.send(`${report}.`);
    });
  }
};
