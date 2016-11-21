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
    apiSecretKey;

const getTestedModule = function getTestedModule(mocks) {
  return proxyquire('./Client', mocks);
};

describe("Client:", () => {
  let apiMock = {
    makeRequest: sinon.stub(),
    setDefaults: sinon.stub()
  };

  before(() => {
    apiKey = 'public api key';
    apiSecretKey = 'super secret key';

    mocks = {
      './api': apiMock
    };

    Client = getTestedModule(mocks);
  });

  beforeEach(() => {
    client = new Client({
      apiKey: apiKey,
      apiSecretKey: apiSecretKey
    });
  });

  afterEach(() => {
    apiMock.makeRequest.reset();
    apiMock.setDefaults.reset();
  });

  describe("Client constructor:", () => {

    beforeEach(() => {
      client = new Client({
        apiKey: apiKey,
        apiSecretKey: apiSecretKey
      });
    });

    afterEach(() => {
      apiMock.makeRequest.reset();
    });

    it('should throw an error if api keys are missing', () => {
      expect(() => {
        client = new Client();
      }).to.throw('Missing API key or API secret key');
    });

    it('should have some basic values', () => {
      expect(client.apiKey).to.equal('public api key');
      expect(client.apiSecretKey).to.equal('super secret key');
      expect(client.accessToken).to.equal('');
      expect(client.host).to.equal('https://marlowe.relinklabs.com');
      expect(client.version).to.equal('1.0');
    });
  });


  describe("setAccessToken method:", () => {

    beforeEach(() => {
      apiMock.setDefaults.reset();
    });

    afterEach(() => {
      apiMock.setDefaults.reset();
    });

    it('should set the access token', () => {
      expect(client.accessToken).to.equal('');
      client.setAccessToken('foobar');
      expect(client.accessToken).to.equal('foobar');
    });

    it('should call the api.setDefaults method', () => {
      client.setAccessToken('foobar');
      expect(apiMock.setDefaults.calledOnce).to.be.true;
      let args = apiMock.setDefaults.args[0][0];
      expect(args).to.deep.equal({
        baseUrl: 'https://marlowe.relinklabs.com',
        json: true,
        headers: {
          Authorization: 'Bearer foobar'
        }
      });
    });
  });

  describe("getAccessToken method:", () => {
    let result,
        setAccessTokenSpy;

    beforeEach(() => {
      result = {
        token: 'token'
      };
      apiMock.makeRequest.returns(Promise.resolve(result));
      setAccessTokenSpy = sinon.spy(client, 'setAccessToken');
    });

    afterEach(() => {
      apiMock.makeRequest.reset();
      setAccessTokenSpy.restore();
    });

    it('should call the api makeRequest method with the correct arguments', () => {
      return client.getAccessToken()
        .then((token) => {
          expect(token).to.equal('token');
          expect(client.accessToken).to.equal('token');
          expect(setAccessTokenSpy.calledOnce).to.be.true;
          expect(apiMock.makeRequest.calledOnce).to.be.true;
          expect(apiMock.makeRequest.calledWith({
            url: '/token',
            method: 'GET',
            headers: {
              Authorization: 'Basic cHVibGljIGFwaSBrZXk6c3VwZXIgc2VjcmV0IGtleQ=='
            }
          })).to.be.true;
        });
    });
  });


  describe("createJob method:", () => {
    let result,
        data;

    beforeEach(() => {
      result = {};
      data = {
        foo: 'bar'
      };
      apiMock.makeRequest.returns(Promise.resolve(result));
    });

    afterEach(() => {
      apiMock.makeRequest.reset();
    });

    it('should call the relinklabs /jobs POST endpoint', () => {
      return client.createJob(data)
        .then((token) => {
          expect(apiMock.makeRequest.calledOnce).to.be.true;
          let args = apiMock.makeRequest.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs',
            method: 'POST',
            body: data
          });
        });
    });
  });


  describe("getJob method:", () => {
    let result,
        jobId;

    beforeEach(() => {
      result = {};
      jobId = 'foo';
      apiMock.makeRequest.returns(Promise.resolve(result));
    });

    afterEach(() => {
      apiMock.makeRequest.reset();
    });

    it('should call the relinklabs /jobs GET endpoint', () => {
      return client.getJob(jobId)
        .then((job) => {
          expect(apiMock.makeRequest.calledOnce).to.be.true;
          let args = apiMock.makeRequest.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs/foo',
            method: 'GET'
          });
        });
    });
  });


  describe("getJobs method:", () => {
    let result,
        query;

    beforeEach(() => {
      result = {};
      query = {
        accountId: 'foo',
        sort: 'company',
        page: 1,
        order: 1,
        resultsPerPage: 20,
        search: 'foo'
      };
      apiMock.makeRequest.returns(Promise.resolve(result));
    });

    afterEach(() => {
      apiMock.makeRequest.reset();
    });

    it('should call the relinklabs /jobs GET endpoint', () => {
      return client.getJobs(query)
        .then((job) => {
          expect(apiMock.makeRequest.calledOnce).to.be.true;
          let args = apiMock.makeRequest.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs',
            method: 'GET',
            qs: query
          });
        });
    });
  });

  describe("updateJob method:", () => {
    let result,
        data,
        jobId;

    beforeEach(() => {
      jobId = 'foo';
      result = {};
      data = {
        expires: 'foo'
      };
      apiMock.makeRequest.returns(Promise.resolve(result));
    });

    afterEach(() => {
      apiMock.makeRequest.reset();
    });

    it('should call the relinklabs /jobs PUT endpoint', () => {
      return client.updateJob(jobId, data)
        .then((job) => {
          expect(apiMock.makeRequest.calledOnce).to.be.true;
          let args = apiMock.makeRequest.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs/' + jobId,
            method: 'PUT',
            body: data
          });
        });
    });
  });

  describe("deleteJob method:", () => {
    let jobId;

    beforeEach(() => {
      jobId = 'foo';
      apiMock.makeRequest.returns(Promise.resolve());
    });

    afterEach(() => {
      apiMock.makeRequest.reset();
    });

    it('should call the relinklabs /jobs DELETE endpoint', () => {
      return client.deleteJob(jobId)
        .then((job) => {
          expect(apiMock.makeRequest.calledOnce).to.be.true;
          let args = apiMock.makeRequest.args[0][0];
          expect(args).to.deep.equal({
            url: '/jobs/' + jobId,
            method: 'DELETE'
          });
        });
    });
  });
});
