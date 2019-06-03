'use strict';

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

const DIV_JURYO = "Juryo";
const DIV_MAKUUCHI = "Makuuchi";

/**
 * From higher to lower
 * @type shortRank : [ division, long rank ]
 */
const RANKS_DIVISIONS_FULL_RANK = {

  "Y1e"   : [ DIV_MAKUUCHI, "Yokozuna"],
  "Y1w"   : [ DIV_MAKUUCHI, "Yokozuna"],
  "Y2e"   : [ DIV_MAKUUCHI, "Yokozuna"],
  "Y2w"   : [ DIV_MAKUUCHI, "Yokozuna"],
  "O1e"   : [ DIV_MAKUUCHI, "Ozeki"],
  "O1w"   : [ DIV_MAKUUCHI, "Ozeki"],
  "O2e"   : [ DIV_MAKUUCHI, "Ozeki"],
  "O2w"   : [ DIV_MAKUUCHI, "Ozeki"],
  "S1e"   : [ DIV_MAKUUCHI, "Sekiwake"],
  "S1w"   : [ DIV_MAKUUCHI, "Sekiwake"],
  "K1e"  : [ DIV_MAKUUCHI, "Komusubi"],
  "K1w"  : [ DIV_MAKUUCHI, "Komusubi"],
  "M1e"  : [ DIV_MAKUUCHI, "Maegashira 1"],
  "M1w"  : [ DIV_MAKUUCHI, "Maegashira 1"],
  "M2e"  : [ DIV_MAKUUCHI, "Maegashira 2"],
  "M2w"  : [ DIV_MAKUUCHI, "Maegashira 2"],
  "M3e"  : [ DIV_MAKUUCHI, "Maegashira 3"],
  "M3w"  : [ DIV_MAKUUCHI, "Maegashira 3"],
  "M4e"  : [ DIV_MAKUUCHI, "Maegashira 4"],
  "M4w"  : [ DIV_MAKUUCHI, "Maegashira 4"],
  "M5e"  : [ DIV_MAKUUCHI, "Maegashira 5"],
  "M5w"  : [ DIV_MAKUUCHI, "Maegashira 5"],
  "M6e"  : [ DIV_MAKUUCHI, "Maegashira 6"],
  "M6w"  : [ DIV_MAKUUCHI, "Maegashira 6"],
  "M7e"  : [ DIV_MAKUUCHI, "Maegashira 7"],
  "M7w"  : [ DIV_MAKUUCHI, "Maegashira 7"],
  "M8e"  : [ DIV_MAKUUCHI, "Maegashira 8"],
  "M8w"  : [ DIV_MAKUUCHI, "Maegashira 8"],
  "M9e"  : [ DIV_MAKUUCHI, "Maegashira 9"],
  "M9w"  : [ DIV_MAKUUCHI, "Maegashira 9"],
  "M10e" : [ DIV_MAKUUCHI, "Maegashira 10"],
  "M10w" : [ DIV_MAKUUCHI, "Maegashira 10"],
  "M11e" : [ DIV_MAKUUCHI, "Maegashira 11"],
  "M11w" : [ DIV_MAKUUCHI, "Maegashira 11"],
  "M12e" : [ DIV_MAKUUCHI, "Maegashira 12"],
  "M12w" : [ DIV_MAKUUCHI, "Maegashira 12"],
  "M13e" : [ DIV_MAKUUCHI, "Maegashira 13"],
  "M13w" : [ DIV_MAKUUCHI, "Maegashira 13"],
  "M14e" : [ DIV_MAKUUCHI, "Maegashira 14"],
  "M14w" : [ DIV_MAKUUCHI, "Maegashira 14"],
  "M15e" : [ DIV_MAKUUCHI, "Maegashira 15"],
  "M15w" : [ DIV_MAKUUCHI, "Maegashira 15"],
  "M16e" : [ DIV_MAKUUCHI, "Maegashira 16"],
  "M16w" : [ DIV_MAKUUCHI, "Maegashira 16"],
  "M17e" : [ DIV_MAKUUCHI, "Maegashira 17"],
  "M17w" : [ DIV_MAKUUCHI, "Maegashira 17"],
  "M18e" : [ DIV_MAKUUCHI, "Maegashira 18"],
  "M18w" : [ DIV_MAKUUCHI, "Maegashira 18"],
  "J1e"  : [ DIV_JURYO, "Juryo 1"],
  "J1w"  : [ DIV_JURYO, "Juryo 1"],
  "J2e"  : [ DIV_JURYO, "Juryo 2"],
  "J2w"  : [ DIV_JURYO, "Juryo 2"],
  "J3e"  : [ DIV_JURYO, "Juryo 3"],
  "J3w"  : [ DIV_JURYO, "Juryo 3"],
  "J4e"  : [ DIV_JURYO, "Juryo 4"],
  "J4w"  : [ DIV_JURYO, "Juryo 4"],
  "J5e"  : [ DIV_JURYO, "Juryo 5"],
  "J5w"  : [ DIV_JURYO, "Juryo 5"],
  "J6e"  : [ DIV_JURYO, "Juryo 6"],
  "J6w"  : [ DIV_JURYO, "Juryo 6"],
  "J7e"  : [ DIV_JURYO, "Juryo 7"],
  "J7w"  : [ DIV_JURYO, "Juryo 7"],
  "J8e"  : [ DIV_JURYO, "Juryo 8"],
  "J8w"  : [ DIV_JURYO, "Juryo 8"],
  "J9e"  : [ DIV_JURYO, "Juryo 9"],
  "J9w"  : [ DIV_JURYO, "Juryo 9"],
  "J10e" : [ DIV_JURYO, "Juryo 10"],
  "J10w" : [ DIV_JURYO, "Juryo 10"],
  "J11e" : [ DIV_JURYO, "Juryo 11"],
  "J11w" : [ DIV_JURYO, "Juryo 11"],
  "J12e" : [ DIV_JURYO, "Juryo 12"],
  "J12w" : [ DIV_JURYO, "Juryo 12"],
  "J13e" : [ DIV_JURYO, "Juryo 13"],
  "J13w" : [ DIV_JURYO, "Juryo 13"],
  "J14e" : [ DIV_JURYO, "Juryo 14"],
  "J14w" : [ DIV_JURYO, "Juryo 14"],
  "J15e" : [ DIV_JURYO, "Juryo 15"],
  "J15w" : [ DIV_JURYO, "Juryo 15"],
  "J16e" : [ DIV_JURYO, "Juryo 16"],
  "J16w" : [ DIV_JURYO, "Juryo 16"],
  "J17e" : [ DIV_JURYO, "Juryo 17"],
  "J17w" : [ DIV_JURYO, "Juryo 17"],
  "J18e" : [ DIV_JURYO, "Juryo 18"],
  "J18w" : [ DIV_JURYO, "Juryo 18"],
  "J19e" : [ DIV_JURYO, "Juryo 19"],
  "J19w" : [ DIV_JURYO, "Juryo 19"],
  "J20e" : [ DIV_JURYO, "Juryo 20"],
  "J20w" : [ DIV_JURYO, "Juryo 20"],
  "J21e" : [ DIV_JURYO, "Juryo 21"],
  "J21w" : [ DIV_JURYO, "Juryo 21"],
  "J22e" : [ DIV_JURYO, "Juryo 22"],
  "J22w" : [ DIV_JURYO, "Juryo 22"],
  "J23e" : [ DIV_JURYO, "Juryo 23"],
  "J23w" : [ DIV_JURYO, "Juryo 23"],
  "J24e" : [ DIV_JURYO, "Juryo 24"],
  "J24w" : [ DIV_JURYO, "Juryo 24"],
  "J25e" : [ DIV_JURYO, "Juryo 25"],
  "J25w" : [ DIV_JURYO, "Juryo 25"],
  "J26e" : [ DIV_JURYO, "Juryo 26"],
  "J26w" : [ DIV_JURYO, "Juryo 26"],
  "J27e" : [ DIV_JURYO, "Juryo 27"],
  "J27w" : [ DIV_JURYO, "Juryo 27"],
  "J28e" : [ DIV_JURYO, "Juryo 28"],
  "J28w" : [ DIV_JURYO, "Juryo 28"],
  "J29e" : [ DIV_JURYO, "Juryo 29"],
  "J29w" : [ DIV_JURYO, "Juryo 29"],
  "J30e" : [ DIV_JURYO, "Juryo 30"],
  "J30w" : [ DIV_JURYO, "Juryo 30"],

};

/**
 * Returns the division of a short rank
 * @param shortRank
 * @returns "Makuuchi" or "Juryo"
 */
exports.getDivision = function (shortRank) {
  let rankInformation = RANKS_DIVISIONS_FULL_RANK[shortRank];
  if (rankInformation) {
    return rankInformation[0];
  } else {
    return null;
  }
};

exports.getFullRank = function (shortRank) {
  return RANKS_DIVISIONS_FULL_RANK[shortRank][1];
};

exports.getDivisions =  function(){
  return [ DIV_MAKUUCHI, DIV_JURYO ];
};

/**
 * Lower ranks rikishis are not used yet in application
 * @param rank {string} full rank names
 * @returns {boolean}
 */
exports.isRankAccepted = function(rank){
  return RANKS_ARRAY.indexOf(rank) > -1;
};