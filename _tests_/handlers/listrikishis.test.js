
const handler = require('../../src/handlers/listrikishis');
const dotenv = require('dotenv');
const aws = require('../../src/provider/aws');
// Let's mock aws "provider"
jest.mock('../../src/provider/aws');

describe('Execute Lambda in Mock env', () => {

  beforeAll(() => {
    dotenv.config();
  });

  test('Get should return the expected content', done => {

    // Given
    let expectedItems = [ { id: "1123"}, { id: "1124"} ];
    aws.dynamoDb.scan = jest.fn().mockImplementation(
      (params, callback) => {
        callback(null, { Items: expectedItems });
      }
    );
    const expectedParams = {
      TableName: process.env['DYNAMODB_TABLE']
    };

    // Then
    function callback(error, data) {
      //
      expect(aws.dynamoDb.scan.mock.calls[0][0]).toEqual(expectedParams);
      expect(data).toEqual({"body": "[{\"id\":\"1123\"},{\"id\":\"1124\"}]", "statusCode": 200});
      // Jest end of test
      done();
    }
    //When
    handler.get(null, null, callback);
  });

});