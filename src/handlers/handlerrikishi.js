'use strict';

const getter = require('../inputs/get-content-to-scrap');
const scrapper = require('../domain/scrap-rikishi');
const creator = require('../outputs/create-rikishi');
const sender = require('../outputs/send-url');
const util = require('../utils/get-parameter');
const disabler = require('../utils/console-disabler');

/**
 * Scrap and create Rikishis
 * @param event
 * @returns result creation or null
 */
module.exports.scraprikishi = async (event) => {
  // START
  if (disabler.isConsoleLogEnabled()) {
    console.log(`Received ${JSON.stringify(event)}`);
  }
  // GET Env
  let sumodb_host = process.env['SUMODB_HOST'];
  let images_path = process.env['IMAGES_PATH'];
  //
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
    let id = parseInt(util.getParameter(url, "r"));
    if (disabler.isConsoleLogEnabled()) {
      console.log(`Received ${url}, id : ${id}, ${urls.length} URLS Remaining`);
    }
    // HTML -> RIKISHI
    if (url && url.length > 0) {
      let htmlContent = await getter.getContentToScrap(url, null);
      let rikishi = await scrapper.scrapRikishi(id, htmlContent);
      creationResult = await creator.create(rikishi);
      if (disabler.isConsoleLogEnabled()) {
        console.log(`Rikishi creation result ${JSON.stringify(creationResult)}`);
      }
      // IMAGE -> S3
      let imagePath = images_path + id + '.jpg';
      // Let's say first that rikishi image is coming from website
      rikishi.imagePath = sumodb_host + imagePath;
      // Then try to download it
      let image = await getter.getContentToScrap(sumodb_host, imagePath);
      if (image) {
        if (disabler.isConsoleLogEnabled()) {
          console.log(`Image ${image.length} received from ${imagePath}`);
        }
        // TODO save to s3
      } else {
        rikishi.imagePath = null;
        console.warn('No image avalaible. Setting it to null');
      }


    }
    // Send message to SNS to process next rikishi
    sender.addUrls(urls);
    let countSent = await sender.sendUrls();
    if (disabler.isConsoleLogEnabled()) {
      console.log(`Scrapped a Rikishi. Sent message for ${countSent} next ones`);
    }

  } catch
    (e) {
    console.error(`Error while processing event ${e.message}`);
  }

  return creationResult;

}
;

