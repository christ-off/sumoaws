'use strict';

const aws = require('../provider/aws');
const ranks = require('../domain/ranks');

/**
 * Return the array of supported divisions
 * @param event
 * @param context
 * @returns {Promise<*[]>}
 */
module.exports.getDivisions = async (event, context) => {
  return ranks.getDivisions();
};

module.exports.getDivision = async (event, context) => {

  const division = event.pathParameter.division;

  return { id: division};
}
