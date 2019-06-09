const handler = require('../../src/handlers/divisions');
const dotenv = require('dotenv');
const aws = require('../../src/provider/aws');
// Let's mock aws "provider"
jest.mock('../../src/provider/aws');

describe('Testing divisions', () => {

  beforeAll(() => {
    dotenv.config();
  });

  test('Should return the expected divisions', async () => {
    expect.assertions(2);
    // WHEN
    const result = await handler.getDivisions();
    // THEN
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[\"Makuuchi\",\"Juryo\"]");
  });

  test('Get should return the expected division', async () => {
    expect.assertions(2);
    // GIVEN
    const expectedFakeRikishis = { Items : [{id: "1123"}, {id: "1124"}]};
    const expectedParams = {
      "TableName": "FakeLocalTableName",
      "FilterExpression": "division = :division",
      "ExpressionAttributeValues": {
        ":division": "makuuchi"
      }
    };
    aws.scanPromise = jest.fn().mockImplementation(() => { return expectedFakeRikishis; } );
    const event = {pathParameters: {division: "makuuchi"}};
    // WHEN
    const result = await handler.getDivision(event, null);
    // THEN
    expect(aws.scanPromise.mock.calls[0][0]).toEqual(expectedParams);
    expect(result).toEqual({"body": "[{\"id\":\"1123\"},{\"id\":\"1124\"}]", "statusCode": 200});

  });

});