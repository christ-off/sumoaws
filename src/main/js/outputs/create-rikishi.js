'use strict';

const aws = require('../provider/aws');


/**
 * Create OR update a rikishi in DynamoDB
 * @param rikishi
 * @param errorCallback
 * @param successCallback
 */
module.exports.create = (rikishi, errorCallback, successCallback) => {

  const timestamp = new Date().getTime();

  let params;
  params = {};
  params.TableName = process.env['DYNAMODB_TABLE'];
  params.Item = rikishi;
  params.Item.createdAt = timestamp;
  params.Item.updatedAt = timestamp;

  aws.dynamoDb.put(params, (error,data) => {
    // handle potential errors
    if (error) {
      console.error(`Unable to create : ${params} message : ${error.message}`);
      errorCallback(error);
    } else {
      console.log(`Rikishi ${JSON.stringify(rikishi)} saved. response : ${JSON.stringify(data)}`);
      successCallback(data);
    }
  });
};