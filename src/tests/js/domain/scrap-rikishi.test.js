const handler = require('../../../main/js/domain/scrap-rikishi');
const fs = require('fs');

let rikishiHtml;

beforeAll(() => {
    rikishiHtml = fs.readFileSync( 'src/tests/resources/hakuho.html');
});

test('should output rikishi data', done => {

  function callback(data) {
    // Then
    expect(data).toBeDefined();
    // Jest end of test
    done();
  }

  //When
  handler.scrapRikishi(rikishiHtml,callback);
});

describe('Testing helper functions', () => {

  test('Rank should be filtered to exclude date info', () => {
    expect(handler.parseHighestRank("Yokozuna (May 2007)")).toBe("Yokozuna");
    expect(handler.parseHighestRank("Maegashira 2")).toBe("Maegashira 2");
  });
});