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
    makeRequest: sinon.stub()
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
    it('should set the access token', () => {
      expect(client.accessToken).to.equal('');
      client.setAccessToken('foo bar');
      expect(client.accessToken).to.equal('foo bar');
    });
  });

  describe("getAccessToken method:", () => {
    let result;

    beforeEach(() => {
      result = {};
      apiMock.makeRequest.returns(Promise.resolve(result));
    });

    afterEach(() => {
      apiMock.makeRequest.reset();
    });

    it('should call the api makeRequest method with the correct arguments', () => {
      return client.getAccessToken()
        .then((token) => {
          expect(apiMock.makeRequest.calledOnce).to.be.true;
          expect(apiMock.makeRequest.calledWith({
            url: 'https://marlowe.relinklabs.com/token',
            method: 'GET',
            headers: {
              Authorization: 'Basic cHVibGljIGFwaSBrZXk6c3VwZXIgc2VjcmV0IGtleQ=='
            }
          })).to.be.true;
        });
    });
  });

});
