'use strict';

const request = require('request-promise');

const Api = {

  makeRequest: function makeRequest(options) {
    let params = {
      uri: options.uri,
      method: options.method || 'GET'
    };

    return request(params);
  }

};

module.exports = Api;
