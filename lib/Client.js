'use strict';

const api = require('./api');

class Client {

  /**
   * constructor
   * @param  {Object} options - takes an object with required and optional
   *                            properties. apiKey and apiSecretKey are always
   *                            required.
   * @return {void}           -
   */
  constructor(options) {
    if (options === undefined) {
      options = {};
    }

    this.apiKey = options.apiKey;
    this.apiSecretKey = options.apiSecretKey;

    this.host = options.host || 'https://marlowe.relinklabs.com';
    this.version = options.version || '1.0';

    this.accessToken = '';

    if (!this.apiKey || !this.apiSecretKey) {
      throw new Error('Missing API key or API secret key');
    }
  }

  /**
   * function to get an access token, this function must be called if you do not
   * currently have a token, or your token has expired
   * @return {Object} - returns an object with a token
   */
  getAccessToken() {
    let basicAuth = this.apiKey + ':' + this.apiSecretKey;

    let opts = {
      url: this.host + '/token',
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + new Buffer(basicAuth).toString('base64')
      }
    };

    return api.makeRequest(opts);
  }

  /**
   * convenience function to set access token after it has expired. Access
   * tokens expire after 60 minutes, so you will have to take this into account
   * when using the SDK to integrate with your application.
   *
   * @param {String} token - the access token you get back from the API when
   *                         calling the Marlowe API /token path
   */
  setAccessToken(token) {
    this.accessToken = token;
  }
}

module.exports = Client;
