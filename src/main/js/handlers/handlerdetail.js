'use strict';

module.exports.scraprikishi = (event) => {
  const url = event.Records[0].Sns.Message;
  console.log('Received ' + url);
};