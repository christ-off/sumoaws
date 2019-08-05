'use strict';

const aws = require('../provider/aws');
const moment = require('moment');
const disabler = require('../utils/console-disabler');

/**
 * Create OR update a rikishi in DynamoDB
 * @param rikishi
 */
module.exports.create = async (rikishi) => {

  if (!rikishi){
    console.warn("No rikishi to save.  Returning null");
    return null;
  }
  // else process
  if (disabler.isConsoleLogEnabled()) {
    console.log(`Going to save ${JSON.stringify(rikishi)}`);
  }

  let params;
  params = {};
  params.TableName = process.env['DYNAMODB_TABLE'];
  params.Item = rikishi;
  params.Item.createdAt = moment.utc().toISOString();
  params.Item.updatedAt = params.Item.createdAt;

  try {
    let result = await aws.putPromise(params);
    if (disabler.isConsoleLogEnabled()) {
      console.log(`Rikishi ${JSON.stringify(rikishi)} saved. response : ${JSON.stringify(result)}`);
    }
    return result;
  } catch (error) {
    console.error(`Unable to create : ${JSON.stringify(params)} message : ${error.message}`);
    throw error;
  }

};