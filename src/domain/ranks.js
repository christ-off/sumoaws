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
 * array of division, long rank, sort
 */
const RANKS_DIVISIONS_FULL_RANK = {

  "Y1e"   : [ DIV_MAKUUCHI, "Yokozuna",1],
  "Y1w"   : [ DIV_MAKUUCHI, "Yokozuna",2],
  "Y2e"   : [ DIV_MAKUUCHI, "Yokozuna",3],
  "Y2w"   : [ DIV_MAKUUCHI, "Yokozuna",4],
  "O1e"   : [ DIV_MAKUUCHI, "Ozeki",5],
  "O1w"   : [ DIV_MAKUUCHI, "Ozeki",6],
  "O2e"   : [ DIV_MAKUUCHI, "Ozeki",7],
  "O2w"   : [ DIV_MAKUUCHI, "Ozeki",8],
  "S1e"   : [ DIV_MAKUUCHI, "Sekiwake",9],
  "S1w"   : [ DIV_MAKUUCHI, "Sekiwake",10],
  "K1e"  : [ DIV_MAKUUCHI, "Komusubi",11],
  "K1w"  : [ DIV_MAKUUCHI, "Komusubi",12],
  "M1e"  : [ DIV_MAKUUCHI, "Maegashira 1",13],
  "M1w"  : [ DIV_MAKUUCHI, "Maegashira 1",14],
  "M2e"  : [ DIV_MAKUUCHI, "Maegashira 2",15],
  "M2w"  : [ DIV_MAKUUCHI, "Maegashira 2",16],
  "M3e"  : [ DIV_MAKUUCHI, "Maegashira 3",17],
  "M3w"  : [ DIV_MAKUUCHI, "Maegashira 3",18],
  "M4e"  : [ DIV_MAKUUCHI, "Maegashira 4",19],
  "M4w"  : [ DIV_MAKUUCHI, "Maegashira 4",20],
  "M5e"  : [ DIV_MAKUUCHI, "Maegashira 5",21],
  "M5w"  : [ DIV_MAKUUCHI, "Maegashira 5",22],
  "M6e"  : [ DIV_MAKUUCHI, "Maegashira 6",23],
  "M6w"  : [ DIV_MAKUUCHI, "Maegashira 6",24],
  "M7e"  : [ DIV_MAKUUCHI, "Maegashira 7",25],
  "M7w"  : [ DIV_MAKUUCHI, "Maegashira 7",26],
  "M8e"  : [ DIV_MAKUUCHI, "Maegashira 8",27],
  "M8w"  : [ DIV_MAKUUCHI, "Maegashira 8",28],
  "M9e"  : [ DIV_MAKUUCHI, "Maegashira 9",29],
  "M9w"  : [ DIV_MAKUUCHI, "Maegashira 9",30],
  "M10e" : [ DIV_MAKUUCHI, "Maegashira 10",31],
  "M10w" : [ DIV_MAKUUCHI, "Maegashira 10",32],
  "M11e" : [ DIV_MAKUUCHI, "Maegashira 11",33],
  "M11w" : [ DIV_MAKUUCHI, "Maegashira 11",34],
  "M12e" : [ DIV_MAKUUCHI, "Maegashira 12",35],
  "M12w" : [ DIV_MAKUUCHI, "Maegashira 12",36],
  "M13e" : [ DIV_MAKUUCHI, "Maegashira 13",37],
  "M13w" : [ DIV_MAKUUCHI, "Maegashira 13",38],
  "M14e" : [ DIV_MAKUUCHI, "Maegashira 14",39],
  "M14w" : [ DIV_MAKUUCHI, "Maegashira 14",40],
  "M15e" : [ DIV_MAKUUCHI, "Maegashira 15",41],
  "M15w" : [ DIV_MAKUUCHI, "Maegashira 15",42],
  "M16e" : [ DIV_MAKUUCHI, "Maegashira 16",43],
  "M16w" : [ DIV_MAKUUCHI, "Maegashira 16",45],
  "M17e" : [ DIV_MAKUUCHI, "Maegashira 17",46],
  "M17w" : [ DIV_MAKUUCHI, "Maegashira 17",47],
  "M18e" : [ DIV_MAKUUCHI, "Maegashira 18",48],
  "M18w" : [ DIV_MAKUUCHI, "Maegashira 18",49],
  "J1e"  : [ DIV_JURYO, "Juryo 1",50],
  "J1w"  : [ DIV_JURYO, "Juryo 1",51],
  "J2e"  : [ DIV_JURYO, "Juryo 2",52],
  "J2w"  : [ DIV_JURYO, "Juryo 2",53],
  "J3e"  : [ DIV_JURYO, "Juryo 3",54],
  "J3w"  : [ DIV_JURYO, "Juryo 3",55],
  "J4e"  : [ DIV_JURYO, "Juryo 4",56],
  "J4w"  : [ DIV_JURYO, "Juryo 4",57],
  "J5e"  : [ DIV_JURYO, "Juryo 5",58],
  "J5w"  : [ DIV_JURYO, "Juryo 5",59],
  "J6e"  : [ DIV_JURYO, "Juryo 6",60],
  "J6w"  : [ DIV_JURYO, "Juryo 6",61],
  "J7e"  : [ DIV_JURYO, "Juryo 7",62],
  "J7w"  : [ DIV_JURYO, "Juryo 7",63],
  "J8e"  : [ DIV_JURYO, "Juryo 8",64],
  "J8w"  : [ DIV_JURYO, "Juryo 8",65],
  "J9e"  : [ DIV_JURYO, "Juryo 9",66],
  "J9w"  : [ DIV_JURYO, "Juryo 9",67],
  "J10e" : [ DIV_JURYO, "Juryo 10",68],
  "J10w" : [ DIV_JURYO, "Juryo 10",69],
  "J11e" : [ DIV_JURYO, "Juryo 11",70],
  "J11w" : [ DIV_JURYO, "Juryo 11",71],
  "J12e" : [ DIV_JURYO, "Juryo 12",72],
  "J12w" : [ DIV_JURYO, "Juryo 12",73],
  "J13e" : [ DIV_JURYO, "Juryo 13",74],
  "J13w" : [ DIV_JURYO, "Juryo 13",75],
  "J14e" : [ DIV_JURYO, "Juryo 14",76],
  "J14w" : [ DIV_JURYO, "Juryo 14",77],
  "J15e" : [ DIV_JURYO, "Juryo 15",78],
  "J15w" : [ DIV_JURYO, "Juryo 15",79],
  "J16e" : [ DIV_JURYO, "Juryo 16",80],
  "J16w" : [ DIV_JURYO, "Juryo 16",81],
  "J17e" : [ DIV_JURYO, "Juryo 17",82],
  "J17w" : [ DIV_JURYO, "Juryo 17",83],
  "J18e" : [ DIV_JURYO, "Juryo 18",84],
  "J18w" : [ DIV_JURYO, "Juryo 18",85],
  "J19e" : [ DIV_JURYO, "Juryo 19",86],
  "J19w" : [ DIV_JURYO, "Juryo 19",87],
  "J20e" : [ DIV_JURYO, "Juryo 20",88],
  "J20w" : [ DIV_JURYO, "Juryo 20",89],
  "J21e" : [ DIV_JURYO, "Juryo 21",90],
  "J21w" : [ DIV_JURYO, "Juryo 21",91],
  "J22e" : [ DIV_JURYO, "Juryo 22",92],
  "J22w" : [ DIV_JURYO, "Juryo 22",93],
  "J23e" : [ DIV_JURYO, "Juryo 23",94],
  "J23w" : [ DIV_JURYO, "Juryo 23",95],
  "J24e" : [ DIV_JURYO, "Juryo 24",96],
  "J24w" : [ DIV_JURYO, "Juryo 24",97],
  "J25e" : [ DIV_JURYO, "Juryo 25",98],
  "J25w" : [ DIV_JURYO, "Juryo 25",99],
  "J26e" : [ DIV_JURYO, "Juryo 26",100],
  "J26w" : [ DIV_JURYO, "Juryo 26",101],
  "J27e" : [ DIV_JURYO, "Juryo 27",102],
  "J27w" : [ DIV_JURYO, "Juryo 27",103],
  "J28e" : [ DIV_JURYO, "Juryo 28",104],
  "J28w" : [ DIV_JURYO, "Juryo 28",105],
  "J29e" : [ DIV_JURYO, "Juryo 29",106],
  "J29w" : [ DIV_JURYO, "Juryo 29",107],
  "J30e" : [ DIV_JURYO, "Juryo 30",108],
  "J30w" : [ DIV_JURYO, "Juryo 30",109],

};

const FULL_RANK = 1;
const SORT = 2;

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
  return RANKS_DIVISIONS_FULL_RANK[shortRank][FULL_RANK];
};

exports.getSort = function (shortRank) {
  return RANKS_DIVISIONS_FULL_RANK[shortRank][SORT];
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