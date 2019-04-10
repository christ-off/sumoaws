'use strict';

const getter = require('../inputs/get-content-to-scrap');
const scrapper = require('../domain/scrap-rikishi');
const creator = require('../outputs/create-rikishi');

/**
 * Scrap and create Rikishis
 * @param event
 * @param context not used
 * @param callback
 */
module.exports.scraprikishi = (event, context, callback) => {

  try {

    const url = event.Records[0].Sns.Message;
    let id = parseInt(exports.getParameter(url,'r'));
    console.log(`Received ${url} id : ${id}`);

    // START
    console.log('Start scraping a Rikishi');

    let handleRikishi = function (rikishi) {
      creator.create(rikishi,
        (error) => {
          callback(error);
        },
        (message) => {
          callback(null, message);
        });
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
      if (url) {
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
  var params = url.split('?')[1].split('&');

  for (var i = 0; i < params.length; i++) {
    var p=params[i].split('=');
    if (p[0] == theParameter) {
      return decodeURIComponent(p[1]);
    }
  }
  return false;
};