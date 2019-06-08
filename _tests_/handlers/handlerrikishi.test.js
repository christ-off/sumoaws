/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../src/handlers/handlerrikishi');
const nock = require('nock');
const dotenv = require('dotenv');
const fs = require('fs');
const moment = require('moment');

/**
 * The "creator" creates records in DynamoDB
 * We are going to mock it
 */
const creator = require('../../src/outputs/create-rikishi');
/**
 * Let jest mock it
 */
jest.mock('../../src/outputs/create-rikishi');

let goodRikishiHtml;
let badRikishiHtml;

const goodRikishiEvent = {
  "Records": [
    {
      "EventSource": "aws:sns",
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:eu-west-3:{{accountId}}:ExampleTopic",
      "Sns": {
        "Type": "Notification",
        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        "TopicArn": "arn:aws:sns:eu-west-3:123456789012:ExampleTopic",
        "Subject": "example subject",
        "Message": "[ \"http://sumodb.sumogames.de/Rikishi.aspx?r=1123\" ]",
        "Timestamp": "1970-01-01T00:00:00.000Z",
        "SignatureVersion": "1",
        "Signature": "EXAMPLE",
        "SigningCertUrl": "EXAMPLE",
        "UnsubscribeUrl": "EXAMPLE",
        "MessageAttributes": {
          "Test": {
            "Type": "String",
            "Value": "TestString"
          },
          "TestBinary": {
            "Type": "Binary",
            "Value": "TestBinary"
          }
        }
      }
    }
  ]
};

const badRikishiEvent = {
  "Records": [
    {
      "EventSource": "aws:sns",
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:eu-west-3:{{accountId}}:ExampleTopic",
      "Sns": {
        "Type": "Notification",
        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        "TopicArn": "arn:aws:sns:eu-west-3:123456789012:ExampleTopic",
        "Subject": "example subject",
        "Message": "[ \"http://sumodb.sumogames.de/Rikishi.aspx?r=12140\" ]",
        "Timestamp": "1970-01-01T00:00:00.000Z",
        "SignatureVersion": "1",
        "Signature": "EXAMPLE",
        "SigningCertUrl": "EXAMPLE",
        "UnsubscribeUrl": "EXAMPLE",
        "MessageAttributes": {
          "Test": {
            "Type": "String",
            "Value": "TestString"
          },
          "TestBinary": {
            "Type": "Binary",
            "Value": "TestBinary"
          }
        }
      }
    }
  ]
};

describe('Test Rikishi handler and utils', () => {

  beforeAll(() => {
    dotenv.config();
    //
    goodRikishiHtml = fs.readFileSync('_tests_/hakuho.html');
    badRikishiHtml = fs.readFileSync('_tests_/takaryu_naoya.html');
    //
  });

  test('Get should create a supported rikishi', async () => {
    expect.assertions(5);
    // GIVEN
    nock(process.env['SUMODB_HOST']).get("/Rikishi.aspx?r=1123").reply(200, goodRikishiHtml);
    creator.create.mockImplementation(() => {
      return new Promise((resolve) => {
        process.nextTick(() => resolve("SAVED"));
      });
    });
    // WHEN
    let data = await handler.scraprikishi(goodRikishiEvent, null);
    // THEN
    expect(data).toBeDefined();
    expect(data).toBe("SAVED");
    expect(creator.create).toBeCalled();
    expect(creator.create.mock.calls[0][0].id).toBe(1123);
    expect(creator.create.mock.calls[0][0].birthdate).toEqual(moment.utc("1985-03-11").toISOString());
  });

  test('Get should NOT create an unsupported rikishi', async () => {
    expect.assertions(2);
    // GIVEN
    nock(process.env['SUMODB_HOST']).get("/Rikishi.aspx?r=12140").reply(200, badRikishiHtml);
    creator.create.mockClear();
    creator.create.mockImplementation(() => {
      return new Promise((resolve) => {
        process.nextTick(() => resolve(null));
      });
    });
    // WHEN
    let data = await handler.scraprikishi(badRikishiEvent, null);
    // THEN
    expect(data).toBeNull();
    expect(creator.create.mock.calls[0][0]).toBeNull();
  });

  test('Get should return an error if content from url is missing', async () => {
    expect.assertions(2);
    // GIVEN
    nock(process.env['SUMODB_HOST']).get("/Rikishi.aspx?r=0").reply(404);
    const badEvent = {
      "Records": [
        {
          "EventSource": "aws:sns",
          "EventVersion": "1.0",
          "EventSubscriptionArn": "arn:aws:sns:eu-west-3:{{accountId}}:ExampleTopic",
          "Sns": {
            "Type": "Notification",
            "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
            "TopicArn": "arn:aws:sns:eu-west-3:123456789012:ExampleTopic",
            "Subject": "example subject",
            "Message": "[ \"http://sumodb.sumogames.de/Rikishi.aspx?r=0\" ]",
            "Timestamp": "1970-01-01T00:00:00.000Z",
            "SignatureVersion": "1",
            "Signature": "EXAMPLE",
            "SigningCertUrl": "EXAMPLE",
            "UnsubscribeUrl": "EXAMPLE",
            "MessageAttributes": {
              "Test": {
                "Type": "String",
                "Value": "TestString"
              },
              "TestBinary": {
                "Type": "Binary",
                "Value": "TestBinary"
              }
            }
          }
        }
      ]
    };
    creator.create.mockClear();
    creator.create.mockImplementation(() => {
      return new Promise((resolve) => {
        process.nextTick(() => resolve(null));
      });
    });
    // WHEN
    let data = await handler.scraprikishi(badEvent, null);
    // THEN
    expect(data).toBeNull();
    expect(creator.create.mock.calls[0][0]).toBeNull();
  });

  test('Get should return null with event missing URL', async () => {
    expect.assertions(1);
    // GIVEN
    const badEvent = {
      "Records": [
        {
          "EventSource": "aws:sns",
          "EventVersion": "1.0",
          "EventSubscriptionArn": "arn:aws:sns:eu-west-3:{{accountId}}:ExampleTopic",
          "Sns": {
            "Type": "Notification",
            "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
            "TopicArn": "arn:aws:sns:eu-west-3:123456789012:ExampleTopic",
            "Subject": "example subject",
            "Message": "",
            "Timestamp": "1970-01-01T00:00:00.000Z",
            "SignatureVersion": "1",
            "Signature": "EXAMPLE",
            "SigningCertUrl": "EXAMPLE",
            "UnsubscribeUrl": "EXAMPLE",
            "MessageAttributes": {
              "Test": {
                "Type": "String",
                "Value": "TestString"
              },
              "TestBinary": {
                "Type": "Binary",
                "Value": "TestBinary"
              }
            }
          }
        }
      ]
    };
    // WHEN
    let data = await handler.scraprikishi(badEvent, null);
    // THEN
    expect(data).toBeNull();
  });

  test('Get should return an null with empty event ', async () => {
    expect.assertions(1);
    // GIVEN
    const fakeEvent = {};
    // WHEN
    let data = await handler.scraprikishi(fakeEvent, null);
    // THEN
    expect(data).toBeNull();
  });

});