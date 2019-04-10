'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (rikishi, fail, success) => {

  const timestamp = new Date().getTime();

  let params;
  params = {};
  params.TableName = process.env['DYNAMODB_TABLE'];
  params.Item = rikishi;
  params.Item.createdAt = timestamp;
  params.Item.updatedAt = timestamp;

  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(`Unable to create :${JSON.stringify(params)} message : ${error.message}`);
      fail(error);
    }
    // create a response
    success(params);
  });
};