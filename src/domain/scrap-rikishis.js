'use strict';

const cheerio = require("cheerio");
const ranks = require("./ranks");

/**
 * Will process an html text async to get a list of links to rikishis
 * @param htmltext
 * @param sumodbhost urls are retrived as relative, so host is needed
 * @returns array of string links
 */
exports.scrapRikishis = async (htmltext, sumodbhost) => {

  console.log(`Scrapping content : ${htmltext.length} bytes`);

  let result = [];

  const $ = cheerio.load(htmltext,  { decodeEntities: false } );
  $('td.layoutright > table > tbody > tr').each(function (i) {
    let children = $(this).children();
    let highestRank = children.eq(4).html();
    let linkItem = children.eq(0).children().eq(0).attr('href');
    let isRankAccepted = ranks.isRankAccepted(highestRank);
    if (isRankAccepted) {
      console.log(`n° ${i} rank ${highestRank} link ${linkItem}`);
      result.push(sumodbhost + "/" + linkItem);
    } else {
      console.log(`n° ${i} rank ${highestRank} link ${linkItem} REJECTED`);
    }
  });

  return result;

};