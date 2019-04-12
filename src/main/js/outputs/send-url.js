'use strict';

const aws = require('../provider/aws');
const config = require('../config/config');

/**
 * Send a SNS message with url as a message
 * @param url
 * @param topic
 * @param errorCallback callback with error as parameter
 * @param successCallback callback with SNS post result
 */
module.exports.sendUrl = function(url, topic, errorCallback, successCallback) {

  console.log(`Going to notify for detail ${url}`);

  const params = {
    Message: url,
    TopicArn: `arn:aws:sns:eu-west-3:${config.awsAccountId}:`+ topic,
  };

  aws.sns.publish(params, (error, data) => {
    if (error) {
      console.error(`Error notifying ${url} with message ${error.message}`);
      console.error(error);
      errorCallback(error);
    } else {
      console.log(`Sent SNS Message with params : ${params}, response : ${data}`);
      successCallback(data);
    }
  });

};