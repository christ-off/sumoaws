'use strict';

const getter = require('../inputs/get-rikishis-to-scrap');
const scrapper = require('../domain/scrap-rikishis');

module.exports.startscrap = async (event, context, callback) => {

  // START
  console.log('Start scraping');
  // Get Env
  let rikishisurl = process.env['rikishisurl'];
  // Log Env
  console.log('Going to scrap ', rikishisurl);

  let processLinks = function (arrayOfLinks) {
    if (arrayOfLinks && arrayOfLinks.length > 0) {
      // TODO call SNS for each link
      console.log(JSON.stringify(arrayOfLinks));
      callback(null, arrayOfLinks);
    } else {
      let error = new Error("No links to process");
      console.error(error.message);
      callback(error);
    }
  };

  let processContent = function (content) {
    if (content) {
      scrapper.scrapRikishis(content, processLinks)
    } else {
      let error = new Error("Not going to scrap because of empty content");
      console.error(error.message);
      callback(error);
    }
  };

  // Performs the Get
  let retrieveHtmlContent = function () {
    if (rikishisurl) {
      getter.getRikishisToScrap(rikishisurl, processContent);
    } else {
      let error = new Error("Mandatory Rikishis URL is empty.");
      console.error(error.message);
      callback(error);
    }
  };

  // DO
  retrieveHtmlContent();
};
