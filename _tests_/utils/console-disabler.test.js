'use strict';

const disabler = require('../../src/utils/console-disabler');
const dotenv = require('dotenv');

describe('Test LOG console log', () => {

  beforeAll(() => {
    dotenv.config();
  });

  test('Console Log should be disabled in tests', () => {
    expect(disabler.isConsoleLogEnabled()).toBeFalsy();
  });

});