const handler = require('../../src/domain/scrap-rikishis');

const EXPECTED_NUMBER_FILTERED_RIKISHIS = 105;

const fs = require('fs');

let rikishisHtml;
beforeAll(() => {
  rikishisHtml = fs.readFileSync( '_tests_/rikishis.html');

});

test('should output rikishis array', done => {
  function callback(data) {
    // Then
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBe(EXPECTED_NUMBER_FILTERED_RIKISHIS);
    expect(data[0]).toBe("http://sumodb.sumogames.de/Rikishi.aspx?r=1123");
    // Jest end of test
    done();
  }

  //When
  handler.scrapRikishis(rikishisHtml, "http://sumodb.sumogames.de", callback);
});