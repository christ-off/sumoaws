'use strict';

const handler = require('../../src/utils/get-parameter');

describe('Test Rikishi handler and utils', () => {

  test('Nominal extract of query string parameter', () => {
    expect(handler.getParameter("http://sumodb.sumogames.de/Rikishi.aspx?r=1123", "r")).toBe("1123");
  });

  test('Impossible extract of query string parameter', () => {
    expect(handler.getParameter("http://sumodb.sumogames.de/Rikishi.aspx?r=1123", "TOTO")).toBeFalsy();
  });

  test('Returning false on empty url', () => {
    expect(handler.getParameter(null, "TOTO")).toBeFalsy();
  });

});