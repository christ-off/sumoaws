
const handler = require('../../src/handlers/listrikishis');
const dotenv = require('dotenv');
const aws = require('../../src/provider/aws');
// Let's mock aws "provider"
jest.mock('../../src/provider/aws');

describe('Execute Lambda in Mock env', () => {

  beforeAll(() => {
    dotenv.config();
  });

  test('Get should return the expected content', async () => {
    expect.assertions(2);
    // GIVEN
    let expectedItems = [ { id: "1123"}, { id: "1124"} ];
    aws.scanPromise = jest.fn().mockImplementation( () => { return { Items: expectedItems }; } );
    const expectedParams = {
      TableName: process.env['DYNAMODB_TABLE']
    };
    // WHEN
    let data = await handler.get(null, null);
    // THEN
    expect(aws.scanPromise.mock.calls[0][0]).toEqual(expectedParams);
    expect(data).toEqual({"body": "[{\"id\":\"1123\"},{\"id\":\"1124\"}]", "statusCode": 200});
  });

});