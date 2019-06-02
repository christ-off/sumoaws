const ranks = require('../../src/domain/ranks');

describe('Testing Ranks operations and lookups', () => {

  test('Should find some Makuuchi', () => {
    expect(ranks.getDivision("Y")).toBe("Makuuchi");
    expect(ranks.getDivision("K1")).toBe("Makuuchi");
    expect(ranks.getDivision("M18")).toBe("Makuuchi");
    expect(ranks.getDivision("M8")).toBe("Makuuchi");
    expect(ranks.getDivision("M1")).toBe("Makuuchi");
  });

  test('Should find some Juryo', () => {
    expect(ranks.getDivision("J1")).toBe("Juryo");
    expect(ranks.getDivision("J18")).toBe("Juryo");
    expect(ranks.getDivision("J9")).toBe("Juryo");
  });

});