const handler = require('../../src/domain/scrap-rikishis');

const EXPECTED_NUMBER_FILTERED_RIKISHIS = 105;

const fs = require('fs');

let rikishisHtml;

describe('Testing Lambda and util functions on Rikishis', () => {

  beforeAll(() => {
    rikishisHtml = fs.readFileSync('_tests_/rikishis.html');
  });

  test('should output rikishis array', async () => {
    // WHEN
    let data = await handler.scrapRikishis(rikishisHtml, "http://sumodb.sumogames.de");
    // THEN
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBe(EXPECTED_NUMBER_FILTERED_RIKISHIS);
    expect(data[0]).toBe("http://sumodb.sumogames.de/Rikishi.aspx?r=1123");
  });

});