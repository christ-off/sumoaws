'use strict';

const aws = require('../provider/aws');


module.exports.get = async (event, context) => {

  const params = {
    TableName: process.env['DYNAMODB_TABLE']
  };

  try {
    let result = await aws.scanPromise(params);
    // create a response
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: {'Content-Type': 'text/plain'},
      body: 'Couldn\'t fetch the rikishis.',
    };
  }
};
