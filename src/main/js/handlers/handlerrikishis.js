'use strict';

const getter = require('../inputs/get-content-to-scrap');
const scrapper = require('../domain/scrap-rikishis');
const sender = require('../outputs/sendurl');

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
  let rikishishost = process.env['rikishishost'];
  let rikishispath = process.env['rikishispath'];
  // Log Env
  console.log('Going to scrap : ', rikishishost + rikishispath);

  let handleLink = function (link) {
    sender.sendUrl(link, "scraprikishi",
      (error) => {
        callback(error);
      })
      // nothing to do in success
  };

  let processLinks = function (arrayOfLinks) {
    if (arrayOfLinks && arrayOfLinks.length > 0) {
      console.log("Going to post to SNS " + arrayOfLinks.length + " links ");
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
      scrapper.scrapRikishis(content, rikishishost, processLinks)
    } else {
      let error = new Error("Not going to scrap because of empty content");
      console.error(error.message);
      callback(error);
    }
  };

  // Performs the Get
  let retrieveHtmlContent = function () {
    if (rikishishost && rikishispath) {
      console.log("Getting webpage to scrap");
      getter.getContentToScrap(rikishishost, rikishispath, processContent);
    } else {
      let error = new Error("Mandatory Rikishis URL is empty.");
      console.error(error.message);
      callback(error);
    }
  };

  // DO
  retrieveHtmlContent();
};
