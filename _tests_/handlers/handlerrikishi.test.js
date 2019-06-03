/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../src/handlers/handlerrikishi');
const nock = require('nock');
const dotenv = require('dotenv');
const fs = require('fs');
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const utc = require("dayjs/plugin/utc");

dayjs.extend(customParseFormat);
dayjs.extend(utc);


/**
 * The "creator" creates records in DynamoDB
 * We are going to mock it
 */
const creator = require('../../src/outputs/create-rikishi');
/**
 * Let jest mock it
 */
jest.mock('../../src/outputs/create-rikishi' );

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
        "Message": "http://sumodb.sumogames.de/Rikishi.aspx?r=1123",
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
        "Message": "http://sumodb.sumogames.de/Rikishi.aspx?r=12140",
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
    goodRikishiHtml = fs.readFileSync( '_tests_/hakuho.html');
    badRikishiHtml = fs.readFileSync( '_tests_/takaryu_naoya.html');
    //
  });

  test('Nominal extract of query string parameter', () => {
    expect(handler.getParameter("http://sumodb.sumogames.de/Rikishi.aspx?r=1123", "r")).toBe("1123");
  });

  test('Impossible extract of query string parameter', () => {
    expect(handler.getParameter("http://sumodb.sumogames.de/Rikishi.aspx?r=1123", "TOTO")).toBeFalsy();
  });

  test('Get should create a supported rikishi', done => {

    // Given
    nock(process.env['SUMODB_HOST']).get("/Rikishi.aspx?r=1123").reply(200, goodRikishiHtml);
    creator.create.mockImplementation( (rikishi, fail, success) => { success("SAVED"); });

    function callback(error, data) {
      // Then
      expect(data).toBeDefined();
      expect(data).toBe("SAVED");
      expect(creator.create).toBeCalled();
      expect(creator.create.mock.calls[0][0].id).toBe(1123);
      expect(creator.create.mock.calls[0][0].birthdate).toEqual(dayjs.utc("1985-03-11").toISOString());
      // Jest end of test
      done();
    }

    //When
    handler.scraprikishi(goodRikishiEvent, null, callback);
  });

  test('Get should NOT create an unsupported rikishi', done => {

    // Given
    nock(process.env['SUMODB_HOST']).get("/Rikishi.aspx?r=12140").reply(200, badRikishiHtml);

    function callback(error, data) {
      // Then
      expect(data).toBeNull();
      // Jest end of test
      done();
    }

    //When
    handler.scraprikishi(badRikishiEvent, null, callback);
  });

  test('Get should return an error if content from url is missing', done => {

    nock(process.env['SUMODB_HOST']).get("/Rikishi.aspx?r=0").reply(404);

    function callback(error) {
      // Then
      expect(error).toBeDefined();
      // Jest end of test
      done();
    }

    //When
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
            "Message": "http://sumodb.sumogames.de/Rikishi.aspx?r=0",
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

    handler.scraprikishi(badEvent, null, callback);
  });

  test('Get should return an error with event missing URL', done => {

    function callback(error) {
      // Then
      expect(error).toBeDefined();
      // Jest end of test
      done();
    }

    //When
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

    handler.scraprikishi(badEvent, null, callback);
  });

  test('Get should return an error with fake event ', done => {

    function callback(error) {
      // Then
      expect(error).toBeDefined();
      // Jest end of test
      done();
    }

    //When
    const fakeEvent = { };

    handler.scraprikishi(fakeEvent, null, callback);
  });

});