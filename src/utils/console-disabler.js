'use strict';

module.exports.isConsoleLogEnabled = () => {
  let disabled = process.env['LOG_DISABLED'];
  if (disabled === undefined || disabled == null){
    return true;
  } else {
    return !disabled;
  }
};