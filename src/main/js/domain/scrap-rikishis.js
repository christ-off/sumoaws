'use strict';

let htmlparser = require("htmlparser2");

const EXPECTED_LINK = 'Rikishi.aspx?r=';

/**
 * Will process an html text async
 * @param htmltext
 * @param callback with one argument array of string links
 * @returns {*}
 */
exports.scrapRikishis = function (htmltext, callback) {

  // Will contain a list of Strings
  let count = 0;
  let result = [];
  // Let's parse 'a' to find thos with rikishis links
  let parser = new htmlparser.Parser({
    onattribute: function (name, value) {
      if (name === "href" && value.indexOf(EXPECTED_LINK) != -1) {
        count++;
        console.log("Got link n°" + count +" on Rikishi :" + value);
        result.push(value);
      }
    },
    onclosetag: function (name) {
      if (name === 'html') {
        console.log("Document done with " + count + " links");
        callback(result);
      }
    }
  }, {decodeEntities: true});
  parser.write(htmltext);
  parser.end();

};