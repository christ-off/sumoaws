'use strict';

let http = require('http');

/**
 * Get an URL content and return it in callback call
 * @param host not endeing with /
 * @param path starting with /
 * @param callback : data maybe null
 */
exports.getContentToScrap = function (host, path, callback) {

  const url = host + (path ? path : "");
  console.log(`Going to get : ${url}`);

  try {

    http.get(url, (res) => {

      const {statusCode} = res;

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed on .${host}${host} Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        callback(null);
      } else {
        console.log("Status is ok. Going to receive data");
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          console.log(`All data retrieved ${rawData.length} bytes`);
          callback(rawData);
        } catch (e) {
          console.error(e.message);
        }
      });

    }).on('error', (e) => {
      console.error(`Unexpected error${e.message}`);
      console.error(e);
    });

  } catch (e) {
    console.error(`Unexpected http error${e.message}`);
    console.error(e);
  }

};