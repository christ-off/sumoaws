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

describe('Persisting Rikishis', () => {

  test('Nominal case', async () => {
    expect.assertions(4);
    // GIVEN
    aws.putPromise = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        process.nextTick(() => resolve("SAVED"));
      });
    });
    // WHEN
    const data = await tested.create(FAKE_RIKISHI);
    // THEN
    expect(data).toBeDefined();
    expect(data).toBe("SAVED");
    expect(aws.putPromise.mock.calls.length).toBe(1);
    expect(aws.putPromise.mock.calls[0][0]).toEqual({Item: FAKE_RIKISHI});

  });

  test('Error case', async () => {
    // GIVEN
    aws.putPromise = jest.fn().mockImplementation( () => { throw new Error("ERROR"); } );
    // WHEN
    try {
      await tested.create(FAKE_RIKISHI);
      // THEN
    } catch (e) {
      expect(e.message).toMatch('ERROR');
    }
  });

});