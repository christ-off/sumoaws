
const handler = require('../../../main/js/handlers/divisions');
const dotenv = require('dotenv');
const aws = require('../../../main/js/provider/aws');
// Let's mock aws "provider"
jest.mock('../../../main/js/provider/aws');

describe('Testing divisions', () => {

  beforeAll(() => {
    dotenv.config();
  });

  test('Should return the expected divisions', async () => {
    expect.assertions(3);
    // WHEN
    const result = await handler.getDivisions();
    // THEN
    expect(result.length).toBe(2);
    expect(result[0]).toBe("Makuuchi");
    expect(result[1]).toBe("Juryo");
  });

  test('Should return the expected Makkuchi division ', async () => {
    expect.assertions(1);
    // WHEN
    let event = { pathParameter : { division : "Makuuchi" }};
    const result = await handler.getDivision(event,null);
    // THEN
    expect(result).toEqual({"id": "Makuuchi"});
  });

});