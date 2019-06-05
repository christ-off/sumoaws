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
  Message: JSON.stringify([SENT_URL,SENT_URL]),
  TopicArn: `arn:aws:sns:eu-west-3:${config.awsAccountId}:scraprikishi`,
};

describe('Sending URLs', () => {

  test('Nominal case', done => {

    // Given
    aws.sns.publish = jest.fn().mockImplementation(
      (params, callback) => {
        callback(null, "POSTED");
      }
    );

    function errorCallback() {
      throw new Error('Error callback should not have been called');
    }

    function sucessCallback(data) {
      // Then
      expect(data).toBeDefined();
      expect(data).toBe("POSTED");
      expect(aws.sns.publish.mock.calls.length).toBe(1);
      expect(aws.sns.publish.mock.calls[0][0]).toEqual(PARAMS);
      // Jest end of test
      done();
    }

    //When
    tested.addUrl(SENT_URL);
    tested.addUrl(SENT_URL);
    tested.sendUrls(errorCallback, sucessCallback);

  });

  test('Error case', done => {

    // Given
    aws.sns.publish = jest.fn().mockImplementation(
      (params, callback) => {
        callback(new Error("ERROR"));
      }
    );

    function errorCallback(error) {
      expect(error).toEqual(new Error("ERROR"));
      // Jest end of test
      done();
    }

    function successCallback() {
      throw new Error('Success callback should not have been called');
    }

    //When
    tested.addUrl(SENT_URL);
    tested.sendUrls(errorCallback, successCallback);

  });

});