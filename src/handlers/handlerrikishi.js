'use strict';

const getter = require('../inputs/get-content-to-scrap');
const scrapper = require('../domain/scrap-rikishi');
const creator = require('../outputs/create-rikishi');
const sender = require('../outputs/send-url');
const util = require('../utils/get-parameter');

/**
 * Scrap and create Rikishis
 * @param event
 * @param context not used
 * @returns result creation or null
 */
module.exports.scraprikishi = async (event, context) => {

  console.log(`Received ${event}`);

  let creationResult = null;

  try {

    // URLS must be an array as a JSON String!
    let urls = JSON.parse(event.Records[0].Sns.Message);
    if (!Array.isArray(urls)) {
      console.error(`Input SNS Message content is not an array ${event.Records[0].Sns.Message}`);
      return null;
    }
    // Prepare what we are working on
    let url = urls.shift(); // return 1st element, removes it from array
    let id = parseInt(util.getParameter(url,"r"));
    console.log(`Received ${url}, id : ${id}, ${urls.length} URLS Remaining`);

    // START
    if (url && url.length > 0) {
      let htmlContent = await getter.getContentToScrap(url, null);
      let rikishi = await scrapper.scrapRikishi(id, htmlContent);
      creationResult = await creator.create(rikishi);
      console.log(`Rikishi creation result ${creationResult}`);
    }

    // Send message to SNS to process next rikishi
    sender.addUrls(urls);
    let countSent = await sender.sendUrls();
    console.log(`Scrapped a Rikishi. Sent message for ${countSent} next ones`);

  } catch (e) {
    console.error(`Error while processing event ${e.message}`);
  }

  return creationResult;

};

