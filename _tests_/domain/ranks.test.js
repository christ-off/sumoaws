const ranks = require('../../src/domain/ranks');
const dotenv = require('dotenv');

describe('Testing Ranks operations and lookups', () => {

  beforeAll(() => {
    dotenv.config();
  });

  test('Should find some Makuuchi', () => {
    expect(ranks.getDivision("Y1e")).toBe("Makuuchi");
    expect(ranks.getDivision("Y1w")).toBe("Makuuchi");
    expect(ranks.getDivision("K1e")).toBe("Makuuchi");
    expect(ranks.getDivision("K1w")).toBe("Makuuchi");
    expect(ranks.getDivision("M18e")).toBe("Makuuchi");
    expect(ranks.getDivision("M18w")).toBe("Makuuchi");
    expect(ranks.getDivision("M8e")).toBe("Makuuchi");
    expect(ranks.getDivision("M8w")).toBe("Makuuchi");
    expect(ranks.getDivision("M1e")).toBe("Makuuchi");
    expect(ranks.getDivision("M1w")).toBe("Makuuchi");
  });

  test('Should find some Juryo', () => {
    expect(ranks.getDivision("J1e")).toBe("Juryo");
    expect(ranks.getDivision("J1w")).toBe("Juryo");
    expect(ranks.getDivision("J18e")).toBe("Juryo");
    expect(ranks.getDivision("J18w")).toBe("Juryo");
    expect(ranks.getDivision("J9e")).toBe("Juryo");
    expect(ranks.getDivision("J9w")).toBe("Juryo");
  });

  test('Return null for unhandled ranks', () => {
    expect(ranks.getDivision("Sd53e")).toBeNull();
    expect(ranks.getDivision("Ms23w")).toBeNull();
  });

  test('Should sort', () => {
    expect(ranks.getSort("Y1e")).toBeLessThan(ranks.getSort("Y1w"));
    expect(ranks.getSort("Y1e")).toBeLessThan(ranks.getSort("J30w"));
    expect(ranks.getSort("S1w")).toBeLessThan(ranks.getSort("M11e"));
    expect(ranks.getSort("J1e")).toBeLessThan(ranks.getSort("J30w"));
  });

});