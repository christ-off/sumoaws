'use strict';

const aws = require('../provider/aws');
const disabler = require('../utils/console-disabler');

/**
 * Create OR update an image into s3
 * See : https://github.com/awsdocs/aws-doc-sdk-examples/blob/master/javascript/example_code/s3/s3_upload.js
 * @param image the image itself (as it was downloaded)
 * @param name name of the image
 * @return s3 direct path
 */
module.exports.save = async (image, name) => {

  if (!image){
    console.warn("No rikishi to save.  Returning null");
    return null;
  }
  // else process

  // TODO

};