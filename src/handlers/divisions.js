'use strict';

const aws = require('../provider/aws');
const ranks = require('../domain/ranks');

/**
 * Return the array of supported divisions
 * @param event
 * @param context
 * @returns {Promise<*[]>}
 */
module.exports.getDivisions = async (event, context) => {
  return ranks.getDivisions();
};

/**
 * We are an aysnc method using aws-sdk
 * See
 * https://techsparx.com/software-development/aws/aws-sdk-promises.html
 * "Getting Promise objects from AWS SDK method calls"
 * On a way to avoid callbacks !
 * https://aws.amazon.com/blogs/compute/node-js-8-10-runtime-now-available-in-aws-lambda/
 * @param event
 * @param context
 * @returns {Promise<void>}
 */
module.exports.getDivision = async (event, context) => {

  // GIVEN
  const division = event.pathParameters.division;

  const params = {
    TableName: process.env['DYNAMODB_TABLE'],
    FilterExpression: {
      ":division": division
    }
  };

  console.log("Going to query " + JSON.stringify(params));
  try {
    let result = await aws.scan(params);
    console.log("getDivision returning " + result.Items.length);
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error(error);
    return error;
  }

};
