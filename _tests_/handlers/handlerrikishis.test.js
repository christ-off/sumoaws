/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../src/handlers/handlerrikishis');
const nock = require('nock');
const dotenv = require('dotenv');
const fs = require('fs');

const LINK = 'http://sumodb.sumogames.de/Rikishi.aspx?r=1123';
let rikishisHtml;

/**
 * We are going to replace send url with a Jest mock
 */
const sender = require('../../src/outputs/send-url');
jest.mock('../../src/outputs/send-url');


describe('Execute Lambda without necessary env FIRST', () => {

  test('Without env an error should be sent back', done => {

    function callback(error, data) {
      // Then
      expect(error).toBeDefined();
      expect(data).toBeUndefined();
      done();
    }

    //When
    handler.startscrap(null, null, callback);
  });

});

describe('Execute Lambda in Mock env', () => {

  beforeAll(() => {
    dotenv.config();
    rikishisHtml = fs.readFileSync('_tests_/rikishis.html');
  });

  beforeEach(() => {
    nock(process.env['SUMODB_HOST']).get(process.env['RIKISHIS_PATH']).reply(200, rikishisHtml);
  });

  test('Get should return the expected content', done => {

    // Given
    sender.sendUrl.mockImplementation((url, topic, errorCallback, successCallback) => {
      successCallback("DONE");
    });

    function callback(error, data) {
      // Then

      const NUMBER_OF_RIKISHIS = 105;
      expect(sender.sendUrl.mock.calls.length).toBe(NUMBER_OF_RIKISHIS);
      expect(data).toBeDefined();
      expect(data.length).toBe(NUMBER_OF_RIKISHIS);
      expect(data[0]).toBe(LINK);
      // Jest end of test
      done();
    }

    //When
    handler.startscrap(null, null, callback);
  });

});