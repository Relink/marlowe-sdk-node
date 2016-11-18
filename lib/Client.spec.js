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

      client.setAccessToken('foo bar');
    });

    afterEach(() => {
      apiMock.makeRequest.reset();
    });

    it('should call the relinklabs /jobs endpoint', () => {
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

});
