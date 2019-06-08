/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const tested = require('../../src/outputs/send-url');
const config = require('../../src/config/config');
const aws = require('../../src/provider/aws');
// Let's mock aws "provider"
jest.mock('../../src/provider/aws');

// Some constants to use and to expect
const SENT_URL = "SENT_URL";
const PARAMS = {
  Message: JSON.stringify([SENT_URL, SENT_URL]),
  TopicArn: `arn:aws:sns:eu-west-3:${config.awsAccountId}:scraprikishi`,
};

describe('Sending URLs', () => {

  test('Nominal case', async () => {
    expect.assertions(4);
    // GIVEN
    aws.publishPromise = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        process.nextTick(() => resolve("POSTED"));
      });
    });
    // WHEN
    tested.addUrl(SENT_URL);
    tested.addUrl(SENT_URL);
    let data = await tested.sendUrls();
    // THEN
    expect(data).toBeDefined();
    expect(data).toBe(2);
    expect(aws.publishPromise.mock.calls.length).toBe(1);
    expect(aws.publishPromise.mock.calls[0][0]).toEqual(PARAMS);
  });

  test('Error case', async () => {
    expect.assertions(1);
    // GIVEN
    aws.publishPromise = jest.fn().mockImplementation( () => { throw new Error("ERROR"); } );
    // WHEN
    tested.addUrl(SENT_URL);
    let data = await tested.sendUrls();
    // THEN
    expect(data).toBe(0);
  });
});