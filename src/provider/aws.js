'use strict';

/**
 * This module is made to provides AWS components
 * It hides their construction
 */

const AWS = require('aws-sdk/index');

exports.dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.sns = new AWS.SNS();

/**
 * Export AWS scan promise sto mock it easily
 * @param params
 * @returns {Request<DocumentClient.ScanOutput, AWSError>}
 */
exports.scan = async (params) => {
  return exports.dynamoDb.scan(params).promise();
};