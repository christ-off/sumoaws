'use strict';

const htmlparser = require("htmlparser2");
const moment = require('moment');

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
 * @param htmltext
 * @param callback with one argument the rikishi object
 * @returns {*}
 */
exports.scrapRikishi = function (htmltext, callback) {

  console.log("Scrapping content : " + htmltext.length + " bytes");
  let rikishi = {};
  // Let's parse 'a' to find thos with rikishis links
  let count = 0;
  let inValTag = false;
  let inTitle = false;

  let parser = new htmlparser.Parser({
    onopentag: function (name, attributes) {
      if (name === "td" && attributes.class && attributes.class === "val") {
        count++;
        inValTag = true;
      } else if (name === "h2"){
        inTitle = true;
      }
    },
    onclosetag: function (name) {
      if (name === 'html') {
        console.log("Document done with " + JSON.stringify(rikishi));
        callback(rikishi);
      } else {
        inValTag = false;
        inTitle = false;
      }
    },
    ontext : function(text){
      if (inTitle) {
        rikishi.shikona = exports.parseName(text);
      } else if (inValTag){
        switch(count) {
          case 1:
            rikishi.highestrank = exports.parseHighestRank(text);
            break;
          case 2:
            rikishi.realname = text;
            break;
          case 3:
            rikishi.birthdate = exports.parseBirthdate(text);
            break;
          case 4:
            rikishi.shusshin = text;
            break;
          case 5:
            rikishi.height = exports.parseHeightOrWeight(text,1);
            rikishi.weight = exports.parseHeightOrWeight(text, 2);
            break;
          case 6:
            rikishi.heya = text;
            break;
          // ignoring other tags with val
        }
      }
    }
  }, {decodeEntities: true});
  parser.write(htmltext);
  parser.end();

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
exports.parseHighestRank = function(brutetext){
    // Protect against bad cases
    if (!brutetext){
      return null;
    }
    // DO
    var arr = rankRegExp.exec(brutetext);
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
 * @returns birthdate as moment
 */
exports.parseBirthdate = function(brutetext){
  // Protect against bad cases
  if (!brutetext){
    return null;
  }
  // DO
  var arr = birthdateRegExp.exec(brutetext);
  if (arr && arr.length === 1) {
    return moment(arr[0],'MMM DD YYYY', 'en');
  } else {
    console.log("Not a birthdate : " + brutetext);
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
exports.parseHeightOrWeight = function(brutetext, index){
  // Protect against bad cases
  if (!brutetext){
    return null;
  }
  // DO
  var arr = heightWeightRegExp.exec(brutetext);
  if (arr && arr.length === 3) {
    if (index === 1) {
      return parseInt(arr[index]);
    } else if (index === 2){
      return parseFloat(arr[index]);
    } else {
      throw "Index " + index + " not supported";
    }
  } else {
    console.log("Not a height and weight : " + brutetext);
    return null;
  }
};

/**
 * Extract the name of the rikishi from strings like
 * 69th Yokozuna Hakuho Sho
 * Takayasu Akira
 * @param brutetext
 */
exports.parseName = function(brutetext){
  let words = brutetext.split(' ');
  if (words.length <=1) {
    console.log("Unexpected name format : " + brutetext);
    return null;
  }
  return words[words.length-2];
};