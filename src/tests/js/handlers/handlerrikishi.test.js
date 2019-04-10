/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../../main/js/handlers/handlerrikishi');
const nock = require('nock');
const dotenv = require('dotenv');
const fs = require('fs');

/**
 * Will hold rikishi page content loaded from test resources
 */
let rikishiHtml;

describe('Test getting paramter from url', () => {

  test('Nominal rank cases filterring out date', () => {
    expect(handler.getParameter("http://sumodb.sumogames.de/Rikishi.aspx?r=1123", "r")).toBe("1123");
  });

});

describe('Execute Rikishi (detail) in Mock env', () => {

  beforeAll(() => {
    dotenv.config();
    rikishiHtml = fs.readFileSync( 'src/tests/resources/hakuho.html');

  });

  beforeEach(() => {
    nock(process.env['RIKISHIS_PATH']).get("/Rikishi.aspx?r=1123").reply(200, rikishiHtml);
  });

  test('Get should return the rikishi', done => {

    function callback(error, data) {
      // Then
      expect(data).toBeDefined();
      expect(data.id).toBe(1123);
      expect(data.highestrank).toBe("Yokozuna");
      expect(data.realname).toBe("MÖNKHBAT Davaajargal");
      expect(data.birthdate.isSame("1985-03-11")).toBeTruthy();
      expect(data.shusshin).toBe("Mongolia, Ulan-Bator");
      expect(data.height).toBe(192);
      expect(data.weight).toBe(152.9);
      expect(data.heya).toBe("Miyagino");
      expect(data.shikona).toBe("Hakuho");
      // Jest end of test
      done();
    }

    //When
    const goodEvent = {
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

    handler.scraprikishi(goodEvent, null, callback);
  });

  test('Get should return an error with event missing URL', done => {

    function callback(error, data) {
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

    function callback(error, data) {
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