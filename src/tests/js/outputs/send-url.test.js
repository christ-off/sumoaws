/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const tested = require('../../../main/js/outputs/send-url');
const config = require('../../../main/js/config/config');
const aws = require('../../../main/js/provider/aws');
// Let's mock aws "provider"
jest.mock('../../../main/js/provider/aws');

// Some constants to use and to expect
const SENT_URL = "SENT_URL";
const TOPIC = "TOPIC";
const PARAMS = {
  Message: SENT_URL,
  TopicArn: `arn:aws:sns:eu-west-3:${config.awsAccountId}:`+ TOPIC,
};

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
  tested.sendUrl(SENT_URL, TOPIC, errorCallback, sucessCallback);

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

  function sucessCallback(data) {
    throw new Error('Success callback should not have been called');
  }

  //When
  tested.sendUrl(SENT_URL, TOPIC, errorCallback, sucessCallback);

});
