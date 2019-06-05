'use strict';

const getter = require('../inputs/get-content-to-scrap');
const scrapper = require('../domain/scrap-rikishi');
const creator = require('../outputs/create-rikishi');
const sender = require('../outputs/send-url');


let nextRikishis(urls, currentError, callback){
  if (urls.length == 0 ){
    let message = 'Last Rikishi was processed';
    console.log(message);
    callback(null, message);
  }  else {
    sender.addUrls(urls);
    sender.sendUrls(
      (error) => {
        callback(error);
      },
      (message) => {
        callback(null, message);
      }
    );
  }
}

/**
 * Scrap and create Rikishis
 * @param event
 * @param context not used
 * @param callback
 */
module.exports.scraprikishi = (event, context, callback) => {

  try {

    // URLS must be an array as a JSON String!
    let urls = JSON.parse(event.Records[0].Sns.Message);
    if (!Array.isArray ( urls )) {
      throw `Input SNS Message content is not an array ${event.Records[0].Sns.Message}`;
    }
    // Prepare what we are working on
    let url = urls.shift(); // return 1st element, removes it from array

    let id = parseInt(exports.getParameter(urls[0],'r'));
    console.log(`Received ${url} id : ${id}`);

    // START
    console.log('Start scraping a Rikishi');

    let handleRikishi = function (rikishi) {
      if (rikishi) {
        creator.create(rikishi,
          (error) => {
            callback(error);
          },
          (message) => {
            callback(null, message);
          });
      } else {
        callback(null,null);
      }
    };

    let processContent = function (content) {
      if (content) {
        console.log("Getting content scrapped");
        scrapper.scrapRikishi(id, content, handleRikishi)
      } else {
        let error = new Error("Not going to scrap because of empty content");
        console.error(error.message);
        callback(error);
      }
    };

    // Performs the Get
    let retrieveHtmlContent = function () {
      if (url && url.length > 0) {
        console.log(`Getting web page to scrap ${url}`);
        getter.getContentToScrap(url, null, processContent);
      } else {
        let error = new Error("Mandatory Rikishi URL is empty.");
        console.error(error.message);
        callback(error);
      }
    };

    // DO
    retrieveHtmlContent();

  } catch (e) {
    console.error(`Error while processing event ${e.message}`);
    callback(e);
  }
};

module.exports.getParameter = (url, theParameter) => {
  // Checks
  if (!url || url.length < 1){
    return false;
  } else {
    // DO
    const params = url.split('?')[1].split('&');
    for (let i = 0; i < params.length; i++) {
      const p = params[i].split('=');
      if (p[0] === theParameter) {
        return decodeURIComponent(p[1]);
      }
    }
    return false;
  }
};