/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../../main/js/inputs/get-rikishis-to-scrap');
const nock = require('nock');

const EXPECTED_RESPONSE = "this is the expected response";

describe('Tests with good request ', () => {

  beforeEach(() => {
    nock("http://perdu.com")
      .get('/')
      .reply(200, EXPECTED_RESPONSE);
  });

  test('Get should return the expected content', done => {

    function callback(data) {
      // Then
      expect(data).toBeDefined();
      expect(data).toBe(EXPECTED_RESPONSE);
      // Jest end of test
      done();
    }

    //When
    handler.getRikishisToScrap("http://perdu.com", "/", callback);
  });

});


describe('Tests with not found response ', () => {

  beforeEach(() => {
    nock("http://perdu.com")
      .get('/')
      .reply(404, null);
  });

  test('should return null on not found request', done => {

    function callback(data) {
      // Then
      expect(data).toBeNull();
      // Jest end of test
      done();
    }

    //When
    handler.getRikishisToScrap("http://perdu.com","/", callback);
  });

});

