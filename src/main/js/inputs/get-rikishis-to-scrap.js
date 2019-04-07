'use strict';

var http = require('http');

/**
 * Get an URL content and return it in callback call
 * @param url
 * @param callback : data maybe null
 */
exports.getRikishisToScrap = function (url, callback) {

  http.get(url, (res) => {
    const { statusCode } = res;

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed on .' + url +'\n' + 'Status Code: ' + statusCode);
    }
    if (error) {
      console.error(error.message);
      // Consume response data to free up memory
      res.resume();
      callback(null);
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        callback(rawData);
      } catch (e) {
        console.error(e.message);
      }
    });

  });

};