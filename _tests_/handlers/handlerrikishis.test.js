/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../src/handlers/handlerrikishis');
const nock = require('nock');
const dotenv = require('dotenv');
const fs = require('fs');

let rikishisHtml;

/**
 * We are going to replace send url with a Jest mock
 */
const sender = require('../../src/outputs/send-url');
jest.mock('../../src/outputs/send-url');

describe('Execute handlerrikishis Lambda in Mock env', () => {

  beforeAll(() => {
    dotenv.config();
    rikishisHtml = fs.readFileSync('_tests_/rikishis.html');
  });

  test('Get should return the expected content', async () => {
    expect.assertions(2);
    // GIVEN
    const NUMBER_OF_RIKISHIS = 105;
    nock(process.env['SUMODB_HOST']).get(process.env['RIKISHIS_PATH']).reply(200, rikishisHtml);
    sender.sendUrls.mockImplementation(() => { return NUMBER_OF_RIKISHIS; } );
    sender.addUrl.mockImplementation(() => { });
    // WHEN
    let data = await handler.startscrap(null, null);
    expect(sender.sendUrls.mock.calls.length).toBe(1);
    expect(data).toBe(NUMBER_OF_RIKISHIS);
  });

});