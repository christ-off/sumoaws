'use strict';

let cheerio = require("cheerio");

// A rikishi must reach a rank in this list
const RANKS_ARRAY = [
  "Juryo 26", "Juryo 27", "Juryo 28", "Juryo 29", "Juryo 30",
  "Juryo 21", "Juryo 22", "Juryo 23", "Juryo 24", "Juryo 25",
  "Juryo 16", "Juryo 17", "Juryo 18", "Juryo 19", "Juryo 20",
  "Juryo 11", "Juryo 12", "Juryo 13", "Juryo 14", "Juryo 15",
  "Juryo 1", "Juryo 2", "Juryo 3", "Juryo 4", "Juryo 5",
  "Juryo 6", "Juryo 7", "Juryo 8", "Juryo 9", "Juryo 10",
  "Komusubi",
  "Maegashira 10", "Maegashira 11", "Maegashira 12",
  "Maegashira 13", "Maegashira 14", "Maegashira 15",
  "Maegashira 16", "Maegashira 17", "Maegashira 18",
  "Maegashira 1", "Maegashira 2", "Maegashira 3",
  "Maegashira 4", "Maegashira 5", "Maegashira 6",
  "Maegashira 7", "Maegashira 8", "Maegashira 9",
  "Ozeki", "Sekiwake", "Yokozuna"
];

/**
 * Will process an html text async to get a list of links to rikishis
 * @param htmltext
 * @param sumodbhost urls are retrived as relative, so host is needed
 * @param callback with one argument array of string links
 * @returns {*}
 */
exports.scrapRikishis = function (htmltext, sumodbhost, callback) {

  console.log(`Scrapping content : ${htmltext.length} bytes`);

  let result = [];

  const $ = cheerio.load(htmltext);
  $('td.layoutright > table > tbody > tr').each(function (i) {
    let children = $(this).children();
    let highestRank = children.eq(4).html();
    let linkItem = children.eq(0).children().eq(0).attr('href');
    let isRankAccepted = (RANKS_ARRAY.indexOf(highestRank) > -1);
    if (isRankAccepted) {
      console.log(`n° ${i} rank ${highestRank} link ${linkItem}`);
      result.push(sumodbhost + "/" + linkItem);
    } else {
      console.log(`n° ${i} rank ${highestRank} link ${linkItem} REJECTED`);
    }
  });

  callback(result);

};