'use strict';

let htmlparser = require("htmlparser2");

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

  let parser = new htmlparser.Parser({
    onopentag: function (name, attributes) {
      if (name === "td" && attributes.class && attributes.class === "val") {
        count++;
        inValTag = true;
      }
    },
    onclosetag: function (name) {
      if (name === 'html') {
        console.log("Document done with " + JSON.stringify(rikishi));
        callback(rikishi);
      } else {
        inValTag = false;
      }
    },
    ontext : function(text){
      if (inValTag){
        switch(count) {
          case 1:
            rikishi.highestrank = text;
        }
      }
    }
  }, {decodeEntities: true});
  parser.write(htmltext);
  parser.end();

};

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
  return brutetext;
};