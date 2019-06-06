'use strict';

/**
 * Method used to extract an id from a rikishi url
 * @param url
 * @param theParameter
 * @returns {string|boolean}
 */
module.exports.getParameter = (url, theParameter) => {
  // Checks
  if (!url || url.length < 1) {
    return false;
  } else {
    // DO
    const params = url.split('?')[1].split('&');
    for (let i = 0; i < params.length; i++) {
      const p = params[i].split('=');
      if (p[0] === theParameter) {
        return decodeURIComponent(p[1]);
      }
    }
    return false;
  }
};