/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../../main/js/handlers/handlerrikishis');
const nock = require('nock');
const dotenv = require('dotenv');

const LINK = 'http://sumodb.sumogames.de/Rikishi.aspx?r=1123';
const FAKE_HTML = "<html><body><a href='" + LINK + "'>Hakuho</a></body></html>";

describe('Execute Lambda in Mock env', () => {

  beforeEach(() => {
    dotenv.config();
  });

  beforeEach(() => {
    nock(process.env['rikishisurl']).get('/').reply(200, FAKE_HTML);
  });

  test('Get should return the expected content', done => {

    function callback(error, data) {
      // Then
      expect(data).toBeDefined();
      expect(data.length).toBe(1);
      expect(data[0]).toBe(LINK);
      // Jest end of test
      done();
    }

    //When
    handler.startscrap(null,null, callback);
  });

});