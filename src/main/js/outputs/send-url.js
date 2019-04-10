'use strict';

const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const config = require('../config/config');

/**
 * Send a SNS message with url as a message
 * @param url
 * @param topic
 * @param errorCallback callback with error as parameter
 */
module.exports.sendUrl = function(url, topic, errorCallback) {

  console.log(`Going to notify for detail ${url}`);

  const params = {
    Message: url,
    TopicArn: `arn:aws:sns:eu-west-3:${config.awsAccountId}:`+ topic,
  };

  sns.publish(params, (error) => {
    if (error) {
      console.error(`Error notifying ${url} with message ${error.message}`);
      console.error(error);
      errorCallback(error);
    } else {
      console.log(`Sent SNS Message with params : ${JSON.stringify(params)}`);
    }
  });

};