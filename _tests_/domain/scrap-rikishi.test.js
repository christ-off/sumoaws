const handler = require('../../src/domain/scrap-rikishi');
const fs = require('fs');
const moment = require('moment');

describe('Testing Lambda and util functions on Rikishis', () => {

  test('should output Hakuho data', async () => {
    expect.assertions(12);
    // GIVEN
    let rikishiHtml = fs.readFileSync('_tests_/hakuho.html');
    // WHEN
    let data = await handler.scrapRikishi(42, rikishiHtml);
    // THEN
    expect(data).toBeDefined();
    expect(data.id).toBe(42);
    expect(data.highestrank).toBe("Yokozuna");
    expect(data.realname).toBe("MÖNKHBAT Davaajargal");
    expect(data.birthdate).toEqual(moment.utc("1985-03-11").toISOString());
    expect(data.shusshin).toBe("Mongolia, Ulan-Bator");
    expect(data.height).toBe(192);
    expect(data.weight).toBe(152.9);
    expect(data.heya).toBe("Miyagino");
    expect(data.shikona).toBe("Hakuho");
    expect(data.rank).toBe("Y1e");
    expect(data.division).toBe("Makuuchi");
  });

  test('should output Goeido data', async () => {
    expect.assertions(12);
    // GIVEN
    let rikishiHtml = fs.readFileSync('_tests_/goeido.html');
    // WHEN
    let data = await handler.scrapRikishi(42, rikishiHtml);
    // THEN
    expect(data).toBeDefined();
    expect(data.id).toBe(42);
    expect(data.highestrank).toBe("Ozeki");
    expect(data.realname).toBe("SAWAI Gotaro");
    expect(data.birthdate).toEqual(moment.utc("1986-04-06").toISOString());
    expect(data.shusshin).toBe("Osaka-fu, Neyagawa-shi");
    expect(data.height).toBe(183);
    expect(data.weight).toBe(158.2);
    expect(data.heya).toBe("Sakaigawa");
    expect(data.shikona).toBe("Goeido");
    expect(data.rank).toBe("O1e");
    expect(data.division).toBe("Makuuchi");
  });

  test('should output null on excluded Rikishi', async () => {
    // GIVEN
    let rikishiHtml = fs.readFileSync('_tests_/takaryu_naoya.html');
    // WHEN
    let data =  await handler.scrapRikishi(42, rikishiHtml);
    // THEN
    expect(data).toBeNull();
  });

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
    expect(handler.parseBirthdate("April 6, 1986 (33 years)")).toEqual(moment.utc("1986-04-06").toISOString());
    expect(handler.parseBirthdate("March 11, 1985 (34 years)")).toEqual(moment.utc("1985-03-11").toISOString());
    expect(handler.parseBirthdate("July 24, 1972")).toEqual(moment.utc("1972-07-24").toISOString());
    expect(handler.parseBirthdate("")).toBeNull();
  });

  test('Height and Weight', () => {
    expect(handler.parseHeightOrWeight("192 cm 152.9 kg", 1)).toBe(192);
    expect(handler.parseHeightOrWeight("192 cm 152.9 kg", 2)).toBe(152.9);

    function exceptionWrapper() {
      handler.parseHeightOrWeight("192 cm 152.9 kg", 3);
    }

    expect(exceptionWrapper).toThrow();
  });

  test('Rikishi name', () => {
    expect(handler.parseName("69th Yokozuna Hakuho Sho")).toBe("Hakuho");
    expect(handler.parseName("Takayasu Akira")).toBe("Takayasu");
    expect(handler.parseName("")).toBeNull();
  });

});