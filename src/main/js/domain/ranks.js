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

  "Y"   : [ DIV_MAKUUCHI, "Yokozuna"],
  "O"   : [ DIV_MAKUUCHI, "Ozeki"],
  "S"   : [ DIV_MAKUUCHI, "Sekiwake"],
  "K1"  : [ DIV_MAKUUCHI, "Komusubi"],
  "M1"  : [ DIV_MAKUUCHI, "Maegashira 1"],
  "M2"  : [ DIV_MAKUUCHI, "Maegashira 2"],
  "M3"  : [ DIV_MAKUUCHI, "Maegashira 3"],
  "M4"  : [ DIV_MAKUUCHI, "Maegashira 4"],
  "M5"  : [ DIV_MAKUUCHI, "Maegashira 5"],
  "M6"  : [ DIV_MAKUUCHI, "Maegashira 6"],
  "M7"  : [ DIV_MAKUUCHI, "Maegashira 7"],
  "M8"  : [ DIV_MAKUUCHI, "Maegashira 8"],
  "M9"  : [ DIV_MAKUUCHI, "Maegashira 9"],
  "M10" : [ DIV_MAKUUCHI, "Maegashira 10"],
  "M11" : [ DIV_MAKUUCHI, "Maegashira 11"],
  "M12" : [ DIV_MAKUUCHI, "Maegashira 12"],
  "M13" : [ DIV_MAKUUCHI, "Maegashira 13"],
  "M14" : [ DIV_MAKUUCHI, "Maegashira 14"],
  "M15" : [ DIV_MAKUUCHI, "Maegashira 15"],
  "M16" : [ DIV_MAKUUCHI, "Maegashira 16"],
  "M17" : [ DIV_MAKUUCHI, "Maegashira 17"],
  "M18" : [ DIV_MAKUUCHI, "Maegashira 18"],
  "J1"  : [ DIV_JURYO, "Juryo 1"],
  "J2"  : [ DIV_JURYO, "Juryo 2"],
  "J3"  : [ DIV_JURYO, "Juryo 3"],
  "J4"  : [ DIV_JURYO, "Juryo 4"],
  "J5"  : [ DIV_JURYO, "Juryo 5"],
  "J6"  : [ DIV_JURYO, "Juryo 6"],
  "J7"  : [ DIV_JURYO, "Juryo 7"],
  "J8"  : [ DIV_JURYO, "Juryo 8"],
  "J9"  : [ DIV_JURYO, "Juryo 9"],
  "J10" : [ DIV_JURYO, "Juryo 10"],
  "J11" : [ DIV_JURYO, "Juryo 11"],
  "J12" : [ DIV_JURYO, "Juryo 12"],
  "J13" : [ DIV_JURYO, "Juryo 13"],
  "J14" : [ DIV_JURYO, "Juryo 14"],
  "J15" : [ DIV_JURYO, "Juryo 15"],
  "J16" : [ DIV_JURYO, "Juryo 16"],
  "J17" : [ DIV_JURYO, "Juryo 17"],
  "J18" : [ DIV_JURYO, "Juryo 18"],
  "J19" : [ DIV_JURYO, "Juryo 19"],
  "J20" : [ DIV_JURYO, "Juryo 20"],
  "J21" : [ DIV_JURYO, "Juryo 21"],
  "J22" : [ DIV_JURYO, "Juryo 22"],
  "J23" : [ DIV_JURYO, "Juryo 23"],
  "J24" : [ DIV_JURYO, "Juryo 24"],
  "J25" : [ DIV_JURYO, "Juryo 25"],
  "J26" : [ DIV_JURYO, "Juryo 26"],
  "J27" : [ DIV_JURYO, "Juryo 27"],
  "J28" : [ DIV_JURYO, "Juryo 28"],
  "J29" : [ DIV_JURYO, "Juryo 29"],
  "J30" : [ DIV_JURYO, "Juryo 30"],

};

/**
 * Returns the division of a short rank
 * @param shortRank
 * @returns "Makuuchi" or "Juryo"
 */
exports.getDivision = function (shortRank) {
  return RANKS_DIVISIONS_FULL_RANK[shortRank][0];
};

exports.getFullRank = function (shortRank) {
  return RANKS_DIVISIONS_FULL_RANK[shortRank][1];
};

exports.getDivisions =  function(){
  return [ DIV_MAKUUCHI, DIV_JURYO ];
};