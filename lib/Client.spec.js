'use strict';

const sinon          = require('sinon');
const chai           = require('chai');
const expect         = chai.expect;
const proxyquire     = require('proxyquire');

chai.use(require('sinon-chai'));

let mocks,
    Client,
    apiKey,
    apiSecretKey;

const getTestedModule = function getTestedModule(mocks) {
  return proxyquire('./Client', mocks);
};

describe("Client:", () => {
  let requestMock = sinon.stub();

  before(() => {
    apiKey = 'public api key';
    apiSecretKey = 'super secret key';

    mocks = {
      'request-promise': requestMock
    };

    Client = getTestedModule(mocks);
  });

  describe("Client constructor:", () => {

    let client;

    beforeEach(() => {
      client = new Client({
        apiKey: apiKey,
        apiSecretKey: apiSecretKey
      });
    });

    afterEach(() => {
      requestMock.reset();
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
});
