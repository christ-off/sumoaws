'use strict';

const getter = require('../inputs/get-content-to-scrap');
const scrapper = require('../domain/scrap-rikishis');
const sender = require('../outputs/send-url');
const disabler = require('../utils/console-disabler');

/**
 * This Lambda is not async
 * I found easier to callback when having the content
 * @returns number of rikishis urls sent
 */
module.exports.startscrap = async () => {
  // START
  if (disabler.isConsoleLogEnabled()) {
    console.log('Start scraping Rikishis List');
  }
  // GET Env
  let sumodb_host = process.env['SUMODB_HOST'];
  let rikishis_path = process.env['RIKISHIS_PATH'];
  // LOG
  if (disabler.isConsoleLogEnabled()) {
    console.log("Going to scrap : ", sumodb_host + rikishis_path);
  }
  // DO
  let htmlContent =  await getter.getContentToScrap(sumodb_host, rikishis_path);
  let arrayOfLinks = await scrapper.scrapRikishis(htmlContent, sumodb_host);
  if (arrayOfLinks && arrayOfLinks.length > 0) {
    sender.addUrls(arrayOfLinks);
    return sender.sendUrls();
  } else {
    return 0;
  }
};
