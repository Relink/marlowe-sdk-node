'use strict';

const request = require('request-promise');
const _       = require('lodash');

const Api = {

  baseRequest: request,

  setDefaults: function setDefaults(options) {
    this.baseRequest = request.defaults(options)
  },

  makeRequest: function makeRequest(options) {
    let params = options;
    params.method = options.method || 'GET';

    return this.baseRequest(params);
  }

};

module.exports = Api;
