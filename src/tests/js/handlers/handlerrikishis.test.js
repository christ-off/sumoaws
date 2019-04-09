/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../../main/js/handlers/handlerrikishis');
const nock = require('nock');
const dotenv = require('dotenv');
const fs = require('fs');

const LINK = 'http://sumodb.sumogames.de/Rikishi.aspx?r=1123';
let rikishisHtml;

describe('Execute Lambda without necessary env FIRST', () => {

  test('Without env an error should be sent back', done => {

    function callback(error, data) {
      // Then
      expect(error).toBeDefined();
      expect(data).toBeUndefined();
      done();
    }

    //When
    handler.startscrap(null,null, callback);
  });

});

describe('Execute Lambda in Mock env', () => {

  beforeAll(() => {
    dotenv.config();
    rikishisHtml = fs.readFileSync( 'src/tests/resources/rikishis.html');
  });

  beforeEach(() => {
    nock(process.env['rikishishost']).get(process.env['rikishispath']).reply(200, rikishisHtml);
  });

  test('Get should return the expected content', done => {

    function callback(error, data) {
      // Then
      expect(data).toBeDefined();
      expect(data.length).toBe(663);
      expect(data[0]).toBe(LINK);
      // Jest end of test
      done();
    }

    //When
    handler.startscrap(null,null, callback);
  });

});