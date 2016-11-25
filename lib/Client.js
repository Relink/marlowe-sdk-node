'use strict';

const _       = require('lodash');
const request = require('request-promise');

class Client {

  /**
   * constructor
   * @param  {Object} options - takes an object with required and optional
   *                            properties. If you have the `RELINK_API_KEY`
   *                            and `RELINK_API_SECRET` environment variables
   *                            set, the contructor will automatically use those
   *                            values. You can also pass this in to this
   *                            constructor using the properties `apiKey` and
   *                            `apiSecret`. Other properties you can pass into
   *                            this contructor are the `host` and `version`
   *                            properties, which defaults to latest version and
   *                            endpoint.
   * @return {void}           -
   */
  constructor(options) {
    if (options === undefined) {
      options = {};
    }

    this.apiKey = process.env.RELINK_API_KEY || options.apiKey;
    this.apiSecret = process.env.RELINK_API_SECRET || options.apiSecret;

    this.host = options.host || 'https://marlowe.relinklabs.com';
    this.version = options.version || '1.0';

    this.accessToken = '';

    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Missing API key or secret');
    }

    this.requestDefaultOptions = {
      baseUrl: this.host,
      json: true
    };

    this.baseRequest = request.defaults(this.requestDefaultOptions);
  }




  /*=====================================
  =            Authorization            =
  =====================================*/


  /**
   * function to get an access token, this function must be called if you do not
   * currently have a token, or your token has expired. This automatically sets
   * your new access token to the client.
   *
   * @return {Object} - returns an object with a token
   */
  getAccessToken() {
    let basicAuth = this.apiKey + ':' + this.apiSecret;

    let opts = {
      url: '/token',
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + new Buffer(basicAuth).toString('base64')
      }
    };

    let accessToken = '';

    return this.baseRequest(opts)
      .then((result) => {
        accessToken = result.token;
        return this.setAccessToken(accessToken);
      })
      .then(() => {
        return accessToken;
      });
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

    let additionalOptions = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    };

    let options = _.merge(this.requestDefaultOptions, additionalOptions);

    this.baseRequest = request.defaults(options);
  }


  /*=====  End of Authorization  ======*/




  /*============================
  =            Jobs            =
  ============================*/

  /**
   * creates a new Job, you need jobs to work with other endpoints, such as
   * /analyze etc
   * @param  {Object} data - the data the job should contain
   * @return {Object}      - returns a Job object
   */
  createJob(data) {
    let opts = {
      url: '/jobs',
      method: 'POST',
      body: data
    };

    return this.baseRequest(opts);
  }

  /**
   * method to require a single job
   * @param  {String} jobId - the id of the job you want to get
   * @return {Object}       - returns a Job object
   */
  getJob(jobId) {
    let opts = {
      url: '/jobs/' + jobId,
      method: 'GET'
    };

    return this.baseRequest(opts);
  }

  /**
   * gets a list of multiple jobs
   * @param  {Object} query - an object containing parameters for sorting,
   *                          paging, searching etc.
   * @return {Object}       - returns an object with results + some additional
   * useful values for paging etc.
   */
  getJobs(query) {
    let opts = {
      url: '/jobs',
      method: 'GET',
      qs: query
    };

    return this.baseRequest(opts);
  }

  /**
   * method to update an existing job
   * @param  {String} jobId - the id of the job you want to update
   * @param  {Object} data  - an object with values you want to update
   * @return {Object}       - returns a Job object
   */
  updateJob(jobId, data) {
    let opts = {
      url: '/jobs/' + jobId,
      method: 'PUT',
      body: data
    };

    return this.baseRequest(opts);
  }

  /**
   * method to delete a job
   * @param  {String} jobId - the id of the job you want to delete
   * @return {void}         - does not return a response other than http 200 OK
   */
  deleteJob(jobId) {
    let opts = {
      url: '/jobs/' + jobId,
      method: 'DELETE'
    };

    return this.baseRequest(opts);
  }


  /*=====  End of Jobs  ======*/



  /*===============================
  =            Analyze            =
  ===============================*/

  /**
   * creates a new analysis from the profile provided
   * @param  {String} jobId   - the id of the job you want to use to create
   *                            the analysis
   * @param  {Object} profile - an object containing the profile data of a
   *                            candidate
   * @return {Object}         - returns the analyzed result
   */
  createAnalysis(jobId, profile) {
    let opts = {
      url: '/analyze',
      method: 'POST',
      body: {
        jobId: jobId,
        profile: profile
      }
    };

    return this.baseRequest(opts);
  }


  /*=====  End of Analyze  ======*/



  /*==============================
  =            Social            =
  ==============================*/

  /**
   * get social data on a candidate
   * @param  {String} email - the email you want to get social data on
   * @return {Object}       - returns an object with url's to profiles
   * and other useful social data
   */
  getSocialData(email) {
    let opts = {
      url: '/social',
      method: 'GET',
      qs: {
        email: email
      }
    };

    return this.baseRequest(opts);
  }

  /*=====  End of Social  ======*/



  /*===============================
  =            Status            =
  ===============================*/

  /**
   * create a new status update on a candidate
   * @param  {Object} body - an object with `jobId`, `email` and `status`. The
   *                         `status` can be any of the following: `disqualify`,
   *                         `consider`, `interview` or `hire`
   * @return {void}        - does not return a response other then 201 OK
   */
  updateStatus(body) {
    let opts = {
      url: '/status',
      method: 'POST',
      body: body
    };

    return this.baseRequest(opts);
  }


  /*=====  End of Status  ======*/
}

module.exports = Client;
