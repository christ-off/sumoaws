'use strict';

const getter = require('../inputs/get-content-to-scrap');
const scrapper = require('../domain/scrap-rikishis');
const sender = require('../outputs/send-url');

/**
 * This Lambda is not async
 * I found easier to callback when having the content
 * @param event
 * @param context
 * @param callback
 */
module.exports.startscrap = (event, context, callback) => {

  // START
  console.log('Start scraping Rikishis List');
  // Get Env
  let sumodb_host = process.env['SUMODB_HOST'];
  let rikishis_path = process.env['RIKISHIS_PATH'];
  // Log Env
  console.log("Going to scrap : ", sumodb_host + rikishis_path);

  let handleLink = function (link) {
    sender.sendUrl(link, "scraprikishi",
      (error,) => {
        callback(error);
      })
  };

  let processLinks = function (arrayOfLinks) {
    if (arrayOfLinks && arrayOfLinks.length > 0) {
      console.log(`Going to post to SNS ${arrayOfLinks.length} links `);
      arrayOfLinks.forEach( (link) => {
        handleLink(link);
      });
      // When all links are sent
      callback(null, arrayOfLinks);
    } else {
      let error = new Error("No links to process");
      console.error(error.message);
      callback(error);
    }
  };

  let processContent = function (content) {
    if (content) {
      console.log("Getting content scrapped");
      scrapper.scrapRikishis(content, sumodb_host, processLinks)
    } else {
      let error = new Error("Not going to scrap because of empty content");
      console.error(error.message);
      callback(error);
    }
  };

  // Performs the Get
  let retrieveHtmlContent = function () {
    if (sumodb_host && rikishis_path) {
      console.log("Getting web page to scrap");
      getter.getContentToScrap(sumodb_host, rikishis_path, processContent);
    } else {
      let error = new Error("Mandatory Rikishis URL is empty.");
      console.error(error.message);
      callback(error);
    }
  };

  // DO
  retrieveHtmlContent();
};
