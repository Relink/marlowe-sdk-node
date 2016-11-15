'use strict';

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
