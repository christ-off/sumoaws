'use strict';

const aws = require('../provider/aws');


module.exports.get = (event, context, callback) => {

  const params = {
    TableName: process.env['DYNAMODB_TABLE']
  };

  aws.dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the rikishis.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
