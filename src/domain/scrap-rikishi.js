'use strict';

const cheerio = require("cheerio");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const utc = require("dayjs/plugin/utc");
const ranks = require("./ranks");

dayjs.extend(customParseFormat);
dayjs.extend(utc);

/**
 * Will process an html text async to get a Rikishi :
 *  Rank
 *  Real name
 *  Birth date
 *  Shusshin
 *  Height
 *  Weight
 *  Shikona
 *  and later the picture through another lambda
 * @param id rikishi's id (same as rikishis url r parameter)
 * @param htmltext
 * @param callback with one argument the rikishi object
 * @returns {*}
 */
exports.scrapRikishi = function (id, htmltext, callback) {

  console.log(`Scrapping content : ${htmltext.length} bytes`);

  let rikishi = {};
  rikishi.id = id;

  const $ = cheerio.load(htmltext,  { decodeEntities: false } );

  // Scrap common Rikishi information
  $('td.layoutright > table.rikishidata > tbody > tr > td > table.rikishidata > tbody > tr ').each(function (i) {
    let children = $(this).children();
    let category = children.eq(0).html();
    let value = children.eq(1).html();
    console.log(`n° ${i} category ${category} value ${value}`);
    switch (category) {
      case "Highest Rank":
        rikishi.highestrank = exports.parseHighestRank(value);
        break;
      case "Real Name":
        rikishi.realname = value;
        break;
      case "Birth Date":
        rikishi.birthdate = exports.parseBirthdate(value);
        break;
      case "Shusshin":
        rikishi.shusshin = value;
        break;
      case "Height and Weight":
        rikishi.height = exports.parseHeightOrWeight(value, 1);
        rikishi.weight = exports.parseHeightOrWeight(value, 2);
        break;
      case "Heya":
        rikishi.heya = value;
        break;
      case "Shikona":
        rikishi.shikona = exports.parseName(value);
        break;
      default:
      // ignored Rikishi information
    }
  });

  // Scap rank from the basho table (last line)
  // Let's read all the line and get the rank
  // at the end we have the latest current rank
  $('.rikishi > tbody > tr').each(function(){
    let children = $(this).children();
    rikishi.rank = children.eq(1).html();
  });

  // Use rank to determine Division
  rikishi.division = ranks.getDivision(rikishi.rank);

  if (rikishi.division) {
    console.log(`Rikishi done with ${JSON.stringify(rikishi)}`);
    callback(rikishi);
  } else {
    console.log(`Rikishi excluded ${JSON.stringify(rikishi)}`);
    callback(null);
  }

};

const rankRegExp = new RegExp("^\\S+\\s?\\d{0,2}");
/**
 * Reveives texts with our without dates
 * Like :
 *  Maegashira 2
 *  or
 *  Yokozuna (May 2007)
 *
 *  1st case : past rank
 *  2nd case : current rank
 *
 * @param brutetext
 */
exports.parseHighestRank = function (brutetext) {
  // Protect against bad cases
  if (!brutetext) {
    return null;
  }
  // DO
  let arr = rankRegExp.exec(brutetext);
  if (arr && arr.length === 1) {
    return arr[0].trim();
  } else {
    console.log("Not a rank : " + brutetext);
    return null;
  }
};

const birthdateRegExp = new RegExp("^\\S+\\s\\d+\\,\\s\\d{4}");
/**
 * Reveives texts with our without age March 11, 1985 (34 years)
 * @param brutetext
 * @returns ISO_8601 millisecond-precision string, shifted to UTC
 */
exports.parseBirthdate = function (brutetext) {
  // Protect against bad cases
  if (!brutetext) {
    return null;
  }
  // DO
  let arr = birthdateRegExp.exec(brutetext);
  if (arr && arr.length === 1) {
    let parsed = dayjs.utc(arr[0], 'MMMM DD YYYY', 'en');
    return parsed.utc().toISOString();
  } else {
    console.log(`Not a birthday : ${brutetext}`);
    return null;
  }
};


const heightWeightRegExp = new RegExp("(\\d{3}) cm (\\d+\\.?\\d) kg");
/**
 * Extract height in cm from string likke 192 cm 152.9 kg
 * @param brutetext
 * @param index 1 for Height, 2 for Weight
 * @returns number height in cm or Weight in kg
 */
exports.parseHeightOrWeight = function (brutetext, index) {
  // Protect against bad cases
  if (!brutetext) {
    return null;
  }
  // DO
  let arr = heightWeightRegExp.exec(brutetext);
  if (arr && arr.length === 3) {
    if (index === 1) {
      return parseInt(arr[index]);
    } else if (index === 2) {
      return parseFloat(arr[index]);
    } else {
      throw `Index ${index} not supported`;
    }
  } else {
    console.log(`Not a height and weight : ${brutetext}`);
    return null;
  }
};

/**
 * Extract the name of the rikishi from strings like
 * 69th Yokozuna Hakuho Sho
 * Takayasu Akira
 * @param brutetext
 */
exports.parseName = function (brutetext) {
  let words = brutetext.split(' ');
  if (words.length <= 1) {
    console.log(`Unexpected name format : ${brutetext}`);
    return null;
  }
  return words[words.length - 2];
};