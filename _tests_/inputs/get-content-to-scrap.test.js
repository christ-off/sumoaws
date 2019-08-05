/**
 * Http mocking done thanks to :
 * https://scotch.io/tutorials/nodejs-tests-mocking-http-requests
 */

const handler = require('../../src/inputs/get-content-to-scrap');
const nock = require('nock');
const dotenv = require('dotenv');

const EXPECTED_RESPONSE = "this is the expected response";

describe('Testing GetRikishi HTTP ', () => {

  beforeAll(() => {
    dotenv.config();
  });

  test('Get should return the expected content', async () => {
    expect.assertions(2);
    // GIVEN
    nock("http://perdu.com").get('/').reply(200, EXPECTED_RESPONSE);
    // WHEN
    let data = await handler.getContentToScrap("http://perdu.com", "/");
    // THEN
    expect(data).toBeDefined();
    expect(data).toBe(EXPECTED_RESPONSE);
  });

  test('should return null on not found request', async () => {
    expect.assertions(1);
    // GIVEN
    nock("http://perdu.com").get('/').reply(404, null);
    // WHEN
    let data = await handler.getContentToScrap("http://perdu.com","/");
    // THEN
    expect(data).toBeNull();
  });

});

