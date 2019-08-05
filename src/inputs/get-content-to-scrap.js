'use strict';

// http module doesn't provide async/promise
const rp = require('request-promise');
const disabler = require('../utils/console-disabler');

/**
 * Get an URL content and return it in callback call
 * @param host not endeing with /
 * @param path starting with /
 * @return html content or null if an error occurred
 */
exports.getContentToScrap = async (host, path) => {

  const url = host + (path ? path : "");
  if (disabler.isConsoleLogEnabled()) {
    console.log(`Going to get : ${url}`);
  }
  try {
    let content = await rp(url);
    if (disabler.isConsoleLogEnabled()) {
      console.log(`All data retrieved ${content.length} bytes`);
    }
    return content;
  } catch (e) {
    console.error(`Unexpected http error ${e.message} for ${url}`);
    return null;
  }

};