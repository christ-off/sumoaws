'use strict';

const getter = require('../inputs/get-content-to-scrap');
const scrapper = require('../domain/scrap-rikishi');


module.exports.scraprikishi = (event, callback) => {

  try {

    const url = event.Records[0].Sns.Message;
    console.log('Received ' + url);

    // START
    console.log('Start scraping a Rikishi');

    let handleRikishi = function (rikishi) {
      console.log("Returining Rikishi. Will have to save it to dynamoDB");
      callback(null, rikishi);
    };

    let processContent = function (content) {
      if (content) {
        console.log("Getting content scrapped");
        scrapper.scrapRikishi(content, handleRikishi)
      } else {
        let error = new Error("Not going to scrap because of empty content");
        console.error(error.message);
        callback(error);
      }
    };

    // Performs the Get
    let retrieveHtmlContent = function () {
      if (url) {
        console.log("Getting webpage to scrap " + url);
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
    console.error("Error while processing event " + e.message);
    callback(e);
  }
};