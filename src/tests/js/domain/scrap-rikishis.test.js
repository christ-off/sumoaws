const handler = require('../../../main/js/domain/scrap-rikishis');
const fs = require('fs');

let rikishisHtml;

beforeAll(() => {
    rikishisHtml = fs.readFileSync( 'src/tests/resources/rikishis.html');
});

test('should output rikishis array', done => {

  function callback(data) {
    // Then
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length > 0).toBeTruthy();
    expect(data[0]).toBe("http://sumodb.sumogames.de/Rikishi.aspx?r=1123");
    // Jest end of test
    done();
  }

  //When
  handler.scrapRikishis(rikishisHtml,callback);
});