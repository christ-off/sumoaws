'use strict';

let cheerio = require('cheerio');
let jsonframe = require('jsonframe-cheerio');

module.exports.schedule = async (event) => {
  /**
   * sumodb.sumogames.de
   * Rikishi list
   * Active
   * By Highest rank desc
   */
  let $ = cheerio.load('http://sumodb.sumogames.de/Rikishi.aspx?shikona=&heya=-1&shusshin=-1&b=-1&high=-1&hd=-1&entry=-1&intai=999999&sort=5');
  jsonframe($); // initializes the plugin

  // Define the scrapping
  var frame = {
    "rikishis": {
      "selector" :
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
