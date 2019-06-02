/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const tested = require('../../src/outputs/create-rikishi');
const aws = require('../../src/provider/aws');

// Let's mock aws "provider"
jest.mock('../../src/provider/aws');

const FAKE_RIKISHI = {
  id: 42
};

test('Nominal case', done => {

  // Given
  aws.dynamoDb.put = jest.fn().mockImplementation(
    (params, callback) => {
      callback(null, "SAVED");
    }
  );

  function errorCallback() {
    throw new Error('Error callback should not have been called');
  }

  function sucessCallback(data) {
    // Then
    expect(data).toBeDefined();
    expect(data).toBe("SAVED");
    expect(aws.dynamoDb.put.mock.calls.length).toBe(1);
    expect(aws.dynamoDb.put.mock.calls[0][0]).toEqual({ Item: FAKE_RIKISHI} );
    // Jest end of test
    done();
  }

  //When
  tested.create(FAKE_RIKISHI, errorCallback, sucessCallback);

});

test('Error case', done => {

// Given
  aws.dynamoDb.put = jest.fn().mockImplementation(
    (params, callback) => {
      callback(new Error("ERROR"));
    }
  );

  function errorCallback(error) {
    expect(error).toEqual(new Error("ERROR"));
    // Jest end of test
    done();
  }

  function sucessCallback() {
    throw new Error('Success callback should not have been called');
  }

  //When
  tested.create(FAKE_RIKISHI, errorCallback, sucessCallback);

});
