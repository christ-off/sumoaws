'use strict';

const aws = require('../provider/aws');
const ranks = require('../domain/ranks');
const disabler = require('../utils/console-disabler');

/**
 * Return the array of supported divisions
 * @returns {Promise<*[]>}
 */
module.exports.getDivisions = async () => {
  let result = ranks.getDivisions();
  // create a response
  const response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  if (disabler.isConsoleLogEnabled()) {
    console.log(`Returning divisions ${JSON.stringify(response)}`);
  }
  return response;
};

/**
 * We are an aysnc method using aws-sdk
 * See
 * https://techsparx.com/software-development/aws/aws-sdk-promises.html
 * "Getting Promise objects from AWS SDK method calls"
 * On a way to avoid callbacks !
 * https://aws.amazon.com/blogs/compute/node-js-8-10-runtime-now-available-in-aws-lambda/
 * @param event
 * @returns {Promise<void>}
 */
module.exports.getDivision = async (event) => {

  if (disabler.isConsoleLogEnabled()) {
    console.log("Going to query Division " + JSON.stringify(event));
  }
  const division = event.pathParameters.division;

  const params = {
    TableName: process.env['DYNAMODB_TABLE'],
    FilterExpression: "division = :division",
    ExpressionAttributeValues: { ":division" : division }
  };
  try {
    if (disabler.isConsoleLogEnabled()) {
      console.log(`Querying division ${JSON.stringify(params)}`);
    }
    let result = await aws.scanPromise(params);
    if (disabler.isConsoleLogEnabled()) {
      console.log("getDivision returning " + result.Items.length);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error(error);
    return error;
  }

};
