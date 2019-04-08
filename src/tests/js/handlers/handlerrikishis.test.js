/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../../main/js/handlers/handlerrikishis');
const nock = require('nock');
const dotenv = require('dotenv');
const fs = require('fs');

const LINK = 'Rikishi.aspx?r=1123';
let rikishisHtml;

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
      expect(data[0].indexOf(LINK)).not.toBe(-1);
      // Jest end of test
      done();
    }

    //When
    handler.startscrap(null,null, callback);
  });

});