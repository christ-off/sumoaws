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
    expect.assertions(3);
    // WHEN
    const result = await handler.getDivisions();
    // THEN
    expect(result.length).toBe(2);
    expect(result[0]).toBe("Makuuchi");
    expect(result[1]).toBe("Juryo");
  });

  test('Get should return the expected division', async () => {

    expect.assertions(2);

    // GIVEN
    const expectedFakeRikishis = { Items : [{id: "1123"}, {id: "1124"}]};
    const expectedParams = {
      "FilterExpression": {
        ":division": "makuuchi"
      },
      "TableName": process.env['DYNAMODB_TABLE']
    }
    aws.scanPromise = jest.fn().mockImplementation((params) => {
      return new Promise((resolve, reject) => {
        process.nextTick(() => resolve(expectedFakeRikishis));
      });
    });
    const event = {pathParameters: {division: "makuuchi"}};

    // WHEN
    const result = await handler.getDivision(event, null);

    // THEN
    expect(aws.scanPromise.mock.calls[0][0]).toEqual(expectedParams);
    expect(result).toEqual({"body": "[{\"id\":\"1123\"},{\"id\":\"1124\"}]", "statusCode": 200});

  });

});