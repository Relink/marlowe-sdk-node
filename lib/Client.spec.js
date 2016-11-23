'use strict';

const sinon          = require('sinon');
const chai           = require('chai');
const expect         = chai.expect;
const proxyquire     = require('proxyquire').noPreserveCache();

chai.use(require('sinon-chai'));

let mocks,
    Client,
    client,
    apiKey,
    apiSecret,
    requestMock;

const getTestedModule = function getTestedModule(mocks) {
  return proxyquire('./Client', mocks);
};

describe("Client:", () => {
  requestMock = sinon.stub();
  requestMock.defaults = sinon.stub();
  requestMock.defaults.returns(requestMock);

  before(() => {
    apiKey = 'public api key';
    apiSecret = 'super secret key';

    mocks = {
      'request-promise': requestMock
    };

    Client = getTestedModule(mocks);
  });

  beforeEach(() => {
    client = new Client({
      apiKey: apiKey,
      apiSecret: apiSecret
    });
  });

  afterEach(() => {
    requestMock.reset();
    requestMock.defaults.reset();
  });


  /*----------  Constructor  ----------*/
  describe("Client constructor:", () => {

    beforeEach(() => {
      client = new Client({
        apiKey: apiKey,
        apiSecret: apiSecret
      });
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should throw an error if api keys are missing', () => {
      expect(() => {
        client = new Client();
      }).to.throw('Missing API key or secret');
    });

    it('should have some basic values', () => {
      expect(client.apiKey).to.equal('public api key');
      expect(client.apiSecret).to.equal('super secret key');
      expect(client.accessToken).to.equal('');
      expect(client.host).to.equal('https://marlowe.relinklabs.com');
      expect(client.version).to.equal('1.0');
    });
  });

  /*----------  setAccessToken  ----------*/
  describe("setAccessToken method:", () => {

    beforeEach(() => {
      requestMock.defaults.reset();
    });

    afterEach(() => {
      requestMock.defaults.reset();
    });

    it('should set the access token', () => {
      expect(client.accessToken).to.equal('');
      client.setAccessToken('foobar');
      expect(client.accessToken).to.equal('foobar');
    });

    it('should call the request.defaults method', () => {
      client.setAccessToken('foobar');

      expect(requestMock.defaults.calledOnce).to.be.true;
      let args = requestMock.defaults.args[0][0];
      expect(args).to.deep.equal({
        baseUrl: 'https://marlowe.relinklabs.com',
        json: true,
        headers: {
          Authorization: 'Bearer foobar'
        }
      });
    });
  });

  /*----------  getAccessToken  ----------*/
  describe("getAccessToken method:", () => {
    let response,
        setAccessTokenSpy;

    beforeEach(() => {
      response = {
        token: 'token'
      };
      requestMock.returns(Promise.resolve(response));
      setAccessTokenSpy = sinon.spy(client, 'setAccessToken');
    });

    afterEach(() => {
      requestMock.reset();
      setAccessTokenSpy.restore();
    });

    it('should call the request method with the correct arguments', () => {
      return client.getAccessToken()
        .then((token) => {
          expect(token).to.equal('token');
          expect(client.accessToken).to.equal('token');
          expect(setAccessTokenSpy.calledOnce).to.be.true;
          expect(requestMock.calledOnce).to.be.true;
          expect(requestMock.calledWith({
            url: '/token',
            method: 'GET',
            headers: {
              Authorization: 'Basic cHVibGljIGFwaSBrZXk6c3VwZXIgc2VjcmV0IGtleQ=='
            }
          })).to.be.true;
        });
    });
  });


  /*============================
  =            Jobs            =
  ============================*/


  /*----------  createJob  ----------*/
  describe("createJob method:", () => {
    let response,
        data;

    beforeEach(() => {
      response = {};
      data = {
        foo: 'bar'
      };
      requestMock.returns(Promise.resolve(response));
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should call the relinklabs /jobs POST endpoint', () => {
      return client.createJob(data)
        .then((token) => {
          expect(requestMock.calledOnce).to.be.true;
          let args = requestMock.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs',
            method: 'POST',
            body: data
          });
        });
    });
  });

  /*----------  getJob  ----------*/
  describe("getJob method:", () => {
    let response,
        jobId;

    beforeEach(() => {
      response = {};
      jobId = 'foo';
      requestMock.returns(Promise.resolve(response));
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should call the relinklabs /jobs GET endpoint', () => {
      return client.getJob(jobId)
        .then((job) => {
          expect(requestMock.calledOnce).to.be.true;
          let args = requestMock.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs/foo',
            method: 'GET'
          });
        });
    });
  });

  /*----------  getJobs  ----------*/
  describe("getJobs method:", () => {
    let response,
        query;

    beforeEach(() => {
      response = {};
      query = {
        accountId: 'foo',
        sort: 'company',
        page: 1,
        order: 1,
        resultsPerPage: 20,
        search: 'foo'
      };
      requestMock.returns(Promise.resolve(response));
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should call the relinklabs /jobs GET endpoint', () => {
      return client.getJobs(query)
        .then((job) => {
          expect(requestMock.calledOnce).to.be.true;
          let args = requestMock.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs',
            method: 'GET',
            qs: query
          });
        });
    });
  });

  /*----------  updateJob  ----------*/
  describe("updateJob method:", () => {
    let response,
        data,
        jobId;

    beforeEach(() => {
      jobId = 'foo';
      response = {};
      data = {
        expires: 'foo'
      };
      requestMock.returns(Promise.resolve(response));
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should call the relinklabs /jobs PUT endpoint', () => {
      return client.updateJob(jobId, data)
        .then((job) => {
          expect(requestMock.calledOnce).to.be.true;
          let args = requestMock.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs/' + jobId,
            method: 'PUT',
            body: data
          });
        });
    });
  });

  /*----------  deleteJob  ----------*/
  describe("deleteJob method:", () => {
    let jobId;

    beforeEach(() => {
      jobId = 'foo';
      requestMock.returns(Promise.resolve());
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should call the relinklabs /jobs DELETE endpoint', () => {
      return client.deleteJob(jobId)
        .then((job) => {
          expect(requestMock.calledOnce).to.be.true;
          let args = requestMock.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs/' + jobId,
            method: 'DELETE'
          });
        });
    });
  });

  /*=====  End of Jobs  ======*/




  /*================================
  =            Analyze            =
  ================================*/

  /*----------  POST analyze  ----------*/
  describe("createAnalysis method:", () => {
    let response,
        data,
        jobId;

    beforeEach(() => {
      jobId = 'foo';
      response = {};
      data = {};
      requestMock.returns(Promise.resolve(response));
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should call the relinklabs /analyze POST endpoint', () => {
      return client.createAnalysis(jobId, data)
        .then((result) => {
          expect(requestMock.calledOnce).to.be.true;
          let args = requestMock.args[0][0];
          expect(args).to.deep.equal({
            url: '/analyze',
            method: 'POST',
            body: {
              jobId: jobId,
              profile: data
            }
          });
        });
    });
  });

  /*=====  End of Analyze  ======*/



  /*================================
  =            Social            =
  ================================*/

  /*----------  GET social  ----------*/
  describe("getSocialData method:", () => {
    let response,
        email;

    beforeEach(() => {
      email = 'foo';
      response = {};
      requestMock.returns(Promise.resolve(response));
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should call the relinklabs /social GET endpoint', () => {
      return client.getSocialData(email)
        .then((result) => {
          expect(requestMock.calledOnce).to.be.true;
          let args = requestMock.args[0][0];
          expect(args).to.deep.equal({
            url: '/social',
            method: 'GET',
            qs: {
              email: email
            }
          });
        });
    });
  });

  /*=====  End of Social  ======*/



  /*================================
  =            Status            =
  ================================*/

  /*----------  POST status  ----------*/
  describe("updateStatus method:", () => {
    let response,
        body;

    beforeEach(() => {
      response = {};
      body = {
        jobId: 'foo',
        email: 'bar',
        status: 'consider'
      };
      requestMock.returns(Promise.resolve(response));
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should call the relinklabs /status POST endpoint', () => {
      return client.updateStatus(body)
        .then((result) => {
          expect(requestMock.calledOnce).to.be.true;
          let args = requestMock.args[0][0];
          expect(args).to.deep.equal({
            url: '/status',
            method: 'POST',
            body: {
              jobId: 'foo',
              email: 'bar',
              status: 'consider'
            }
          });
        });
    });
  });

  /*=====  End of Status  ======*/
});
