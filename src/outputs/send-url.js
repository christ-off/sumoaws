'use strict';

const aws = require('../provider/aws');
const config = require('../config/config');

const TOPIC = "scraprikishi";

/**
 * Is going to hold urls to send on one packet
 * @type {Array}
 */
let   urlsToSend = [];

/**
 * Add an url to the array
 * @param url
 */
module.exports.addUrl = function(url) {
  urlsToSend.push(url);
};

/**
 * Add URLs
 * @param urls
 */
module.exports.addUrls = function(urls) {
  urlsToSend = urls;
};

/**
 * Send a SNS message with url as a message
 * @param errorCallback callback with error as parameter
 * @param successCallback callback with SNS post result
 */
module.exports.sendUrls = function(errorCallback, successCallback) {

  console.log(`Going send ${urlsToSend.length} urls`);

  const params = {
    Message: JSON.stringify(urlsToSend),
    TopicArn: `arn:aws:sns:eu-west-3:${config.awsAccountId}:`+ TOPIC,
  };

  aws.sns.publish(params, (error, data) => {
    if (error) {
      // In case of error we don't empty urlsToSend (to allow another try )
      console.error(`Error notifying ${urlsToSend.length} urls with message ${error.message}`);
      console.error(error);
      errorCallback(error);
    } else {
      urlsToSend = [];
      console.log(`Sent SNS Message with params : ${JSON.stringify(params)}, response : ${JSON.stringify(data)}`);
      successCallback(data);
    }
  });

};