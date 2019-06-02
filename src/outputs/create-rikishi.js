'use strict';

const aws = require('../provider/aws');
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const utc = require("dayjs/plugin/utc");

dayjs.extend(customParseFormat);
dayjs.extend(utc);

/**
 * Create OR update a rikishi in DynamoDB
 * @param rikishi
 * @param errorCallback
 * @param successCallback
 */
module.exports.create = (rikishi, errorCallback, successCallback) => {

  let params;
  params = {};
  params.TableName = process.env['DYNAMODB_TABLE'];
  params.Item = rikishi;
  params.Item.createdAt = dayjs.utc().toISOString();
  params.Item.updatedAt = params.Item.createdAt;

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