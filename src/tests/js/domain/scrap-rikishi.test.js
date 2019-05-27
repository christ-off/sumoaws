const handler = require('../../../main/js/domain/scrap-rikishi');
const fs = require('fs');
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const utc = require("dayjs/plugin/utc");

dayjs.extend(customParseFormat);
dayjs.extend(utc);

let rikishiHtml;

describe('Testing Lambda', () => {

  beforeAll(() => {
    rikishiHtml = fs.readFileSync('src/tests/resources/hakuho.html');
  });

  test('should output rikishi data', done => {

    function callback(data) {
      // Then
      expect(data).toBeDefined();
      expect(data.id).toBe(42);
      expect(data.highestrank).toBe("Yokozuna");
      expect(data.realname).toBe("MÖNKHBAT Davaajargal");
      expect(data.birthdate).toEqual(dayjs.utc("1985-03-11").toISOString());
      expect(data.shusshin).toBe("Mongolia, Ulan-Bator");
      expect(data.height).toBe(192);
      expect(data.weight).toBe(152.9);
      expect(data.heya).toBe("Miyagino");
      expect(data.shikona).toBe("Hakuho");
      expect(data.rank).toBe("Y1e");
      // Jest end of test
      done();
    }

    //When
    handler.scrapRikishi(42, rikishiHtml, callback);
  });

});

describe('Testing helper functions', () => {

  test('Nominal rank cases filterring out date', () => {
    expect(handler.parseHighestRank("Sekiwake")).toBe("Sekiwake");
    expect(handler.parseHighestRank("Sekiwake (May 2007)")).toBe("Sekiwake");
    expect(handler.parseHighestRank("Yokozuna (May 2007)")).toBe("Yokozuna");
    expect(handler.parseHighestRank("Maegashira 2")).toBe("Maegashira 2");
  });

  test('Non nominal rank cases', () => {
    expect(handler.parseHighestRank("")).toBeNull();
    expect(handler.parseHighestRank(null)).toBeNull();
  });

  test('Birthdates', () => {
    expect(handler.parseBirthdate("March 11, 1985 (34 years)")).toEqual(dayjs.utc("1985-03-11").toISOString());
    expect(handler.parseBirthdate("July 24, 1972")).toEqual(dayjs.utc("1972-07-24").toISOString());
    expect(handler.parseBirthdate("")).toBeNull();
  });

  test('Height and Weight', () => {
    expect(handler.parseHeightOrWeight("192 cm 152.9 kg",1)).toBe(192);
    expect(handler.parseHeightOrWeight("192 cm 152.9 kg",2)).toBe(152.9);
    function exceptionWrapper(){
      handler.parseHeightOrWeight("192 cm 152.9 kg",3);
    }
    expect(exceptionWrapper).toThrow();
  });

  test('Rikishi name', () => {
    expect(handler.parseName("69th Yokozuna Hakuho Sho")).toBe("Hakuho");
    expect(handler.parseName("Takayasu Akira")).toBe("Takayasu");
    expect(handler.parseName("")).toBeNull();
  });

});