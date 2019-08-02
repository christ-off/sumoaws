'use strict';

// http module doesn't provide async/promise
const rp = require('request-promise');

/**
 * Get an URL content and return it in callback call
 * @param host not endeing with /
 * @param path starting with /
 * @return html content or null if an error occurred
 */
exports.getContentToScrap = async (host, path) => {

  const url = host + (path ? path : "");
  console.log(`Going to get : ${url}`);
  try {
    let content = await rp(url);
    console.log(`All data retrieved ${content.length} bytes`);
    return content;
  } catch (e) {
    console.error(`Unexpected http error${e.message}`);
    console.error(e);
    return null;
  }

};