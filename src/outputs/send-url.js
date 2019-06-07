'use strict';

const aws = require('../provider/aws');
const config = require('../config/config');

const TOPIC = "scraprikishi";

/**
 * Is going to hold urls to send on one packet
 * @type {Array}
 */
let urlsToSend = [];

/**
 * Add an url to the array
 * @param url
 */
module.exports.addUrl = function (url) {
  urlsToSend.push(url);
};

/**
 * Add URLs
 * @param urls
 */
module.exports.addUrls = function (urls) {
  urlsToSend = urls;
};

/**
 * Send a SNS message with url as a message
 * @returns number of urls sent in message
 */
module.exports.sendUrls = async () => {

  console.log(`Going send ${urlsToSend.length} urls`);

  const params = {
    Message: JSON.stringify(urlsToSend),
    TopicArn: `arn:aws:sns:eu-west-3:${config.awsAccountId}:` + TOPIC,
  };

  try {
    let nbSent = urlsToSend.length;
    let result = await aws.publishPromise(params);
    urlsToSend = [];
    console.log(`Sent SNS Message with params : ${JSON.stringify(params)}, response : ${JSON.stringify(result)}`);
    return nbSent;
  } catch (error) {
    // In case of error we don't empty urlsToSend (to allow another try )
    console.error(`Error notifying ${urlsToSend.length} urls with message ${error.message}`);
    console.error(error);
    return 0;
  }
};